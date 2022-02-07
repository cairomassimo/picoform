import { css } from "@emotion/css";
import { defineMessage } from "@formatjs/intl";
import { useCallback, useEffect, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { alphabet, computeCheckDigit, dashesIndexes, partDefinitions, patternString } from "./token";

export function useTokenState() {
  const [unsavedToken, setUnsavedToken] = useState(() => {
    return new URLSearchParams(window.location.search).get("t") ?? sessionStorage.getItem("token");
  });

  const [token, setToken] = useState(() => {
    try {
      const value = localStorage.getItem("token");
      return unsavedToken === null || value === unsavedToken ? value : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    window.history.replaceState(undefined, "", "?");
  }, []);

  return {
    unsavedToken,
    setUnsavedToken: useCallback((value: string) => {
      setUnsavedToken(value || null);
      try {
        if (value === null) sessionStorage.removeItem("token");
        else sessionStorage.setItem("token", value);
      } catch {
        // No-op
      }
    }, []),
    token,
    setToken: useCallback((value: string | null) => {
      setToken(value);
      try {
        if (value === null) localStorage.removeItem("token");
        else localStorage.setItem("token", value);
      } catch {
        // No-op
      }
    }, []),
  };
}

export type TokenState = ReturnType<typeof useTokenState>;

export function TokenForm({ tokenState }: { tokenState: TokenState }) {
  const intl = useIntl();
  const { unsavedToken, setUnsavedToken, token, setToken } = tokenState;

  return (
    <section
      className={css`
        margin: 1rem 0;
      `}
    >
      <h2>
        <FormattedMessage defaultMessage="Set your token" id="token-form-title" />
      </h2>
      <form
        className={css`
          display: flex;
          width: fit-content;
          flex-flow: column;
          gap: 1rem;
        `}
        onSubmit={(event) => {
          event.preventDefault();
          const input = event.currentTarget.elements.namedItem("token") as HTMLInputElement;
          checkToken(input, intl);
          if (event.currentTarget.checkValidity()) {
            setToken(input.value);
            setUnsavedToken(input.value);
          } else {
            event.currentTarget.reportValidity();
          }
        }}
      >
        <label
          className={css`
            display: flex;
            flex-flow: column;
          `}
          htmlFor="token"
        >
          <FormattedMessage defaultMessage="Your token" id="token-input-label" />

          <input
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            enterKeyHint="done"
            className={css`
              padding: 0.5rem;
              font-family: monospace;
              font-size: 1.5rem;
              font-weight: bold;
            `}
            size={12}
            disabled={token !== null}
            pattern={patternString}
            required
            id="token"
            defaultValue={token ?? unsavedToken ?? ""}
            type={token ? "password" : "text"}
            placeholder="xxx-xxxx-xxx"
            onChange={(event) => {
              const input = event.currentTarget;
              setUnsavedToken(input.value);
              if (event.nativeEvent instanceof InputEvent) fixDashes(input, event.nativeEvent);
              checkToken(input, intl);
            }}
          />
        </label>

        <div
          className={css`
            display: flex;
            gap: 1rem;
          `}
        >
          <button
            className={css`
              flex: 1 0;
              font-size: 1.5rem;
              padding: 0.5rem 1rem;
            `}
            disabled={token !== null}
            type="submit"
          >
            <FormattedMessage defaultMessage="Set token" id="token-submit-label" />
          </button>

          <button
            type="button"
            disabled={token === null}
            onClick={() => {
              setToken(null);
            }}
          >
            <FormattedMessage defaultMessage="Change token" id="token-change-label" />
          </button>
        </div>
      </form>
    </section>
  );
}

function fixDashes(input: HTMLInputElement, event: InputEvent) {
  if (!event.inputType.includes("insert")) return; // Ignore deletions and other changes
  if (input.selectionStart !== input.value.length) return; // Ignore changes in the middle

  const { value } = input;

  let fixStart = 0;
  let fixPart = 0;

  for (;;) {
    const index = value.substring(fixStart).indexOf("-");

    if (fixPart === partDefinitions.length - 1) {
      if (index !== -1) return; // Stop if unexpected extra dash
      break;
    } else {
      if (index === -1) break; // Ok, possibly something to fix
      if (index !== partDefinitions[fixPart].length) return; // Stop if misplaced dash

      fixStart += index + 1;
      fixPart += 1;
    }
  }

  for (; fixPart < partDefinitions.length - 1; fixPart += 1) {
    const dashIndex = partDefinitions[fixPart].end;
    if (input.value.length < dashIndex) break; // Not long enough to insert next dash
    input.setRangeText("-", dashIndex, dashIndex);
  }

  input.setSelectionRange(input.value.length, input.value.length, "none");
}

function checkToken(input: HTMLInputElement, intl: IntlShape) {
  const lowerCased = input.value.toLowerCase();
  if (input.value !== lowerCased) {
    const { selectionStart, selectionEnd } = input;
    input.setRangeText(lowerCased, 0, lowerCased.length);
    input.setSelectionRange(selectionStart, selectionEnd);
  }

  const characters = Array.from(input.value).map((c, i) => ({ c, i }));
  const invalidCharacters = characters.filter(({ c }) => c !== "-" && !alphabet.includes(c));
  const dashes = characters.filter(({ c }) => c === "-").map(({ i }) => i);

  let errors: string[] = [];

  if (invalidCharacters.length > 0) {
    errors.push(
      intl.formatMessage(
        defineMessage({
          defaultMessage: `Token contains unexpected characters: {characters}.`,
          id: `token-invalid-characters-error`,
        }),
        { characters: invalidCharacters.map(({ c }) => `'${c}'`).join(", ") }
      )
    );
  }

  const expectedLength = partDefinitions[partDefinitions.length - 1].end;

  if (characters.length < expectedLength) {
    errors.push(
      intl.formatMessage(defineMessage({ defaultMessage: `Token is too short.`, id: `token-too-short-error` }))
    );
  }

  if (characters.length > expectedLength) {
    errors.push(
      intl.formatMessage(defineMessage({ defaultMessage: `Token is too long.`, id: `token-too-long-error` }))
    );
  }

  if (dashes.length > dashesIndexes.length) {
    errors.push(
      intl.formatMessage(
        defineMessage({ defaultMessage: `Token contains an extra dash (-).`, id: `token-extra-dash-error` })
      )
    );
  }

  if (dashes.length < dashesIndexes.length) {
    errors.push(
      intl.formatMessage(
        defineMessage({ defaultMessage: `Token is missing a dash (-).`, id: `token-missing-dash-error` })
      )
    );
  }

  if (dashes.some((i, j) => dashesIndexes[j] !== i)) {
    errors.push(
      intl.formatMessage(
        defineMessage({ defaultMessage: `Token contains a misplaced dash (-).`, id: `token-misplaced-dash-error` })
      )
    );
  }

  if (errors.length === 0) {
    const digits = characters.filter(({ c }) => c !== "-").map(({ c }) => c);
    const checkDigit = computeCheckDigit(digits.slice(0, -1));

    if (digits[digits.length - 1] !== checkDigit) {
      console.log(`Wrong check digit, expected: '${checkDigit}'`);
      errors.push(
        intl.formatMessage(defineMessage({ defaultMessage: `Token contains an error.`, id: `token-check-digit-error` }))
      );
    }
  }

  input.setCustomValidity(errors.join(" "));
}
