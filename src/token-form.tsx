import { css } from "@emotion/css";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

type TokenState = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export function useTokenState(): TokenState {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });
  return { token, setToken };
}

export function TokenForm({ tokenState }: { tokenState: TokenState }) {
  const { token, setToken } = tokenState;

  return (
    <form
      className={css`
        display: flex;
        flex-flow: column;
        margin: 2rem auto;
      `}
      onSubmit={(event) => {
        event.preventDefault();
        const input = event.currentTarget.elements.namedItem("token") as HTMLInputElement;
        setToken(input.value);
        try {
          localStorage.setItem("token", input.value);
        } catch {
          // No-op
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
      </label>
      <div
        className={css`
          display: flex;
          gap: 1rem;
        `}
      >
        <input
          autoComplete="off"
          className={css`
            padding: 0.5rem;
            font-family: monospace;
            font-size: 1.5rem;
            font-weight: bold;
          `}
          disabled={token !== null}
          required
          id="token"
          defaultValue={token ?? ""}
          type={token ? "password" : "text"}
        />

        <button
          className={css`
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
            try {
              return localStorage.removeItem("token");
            } catch {
              // No-op
            }
          }}
        >
          <FormattedMessage defaultMessage="Change token" id="token-chnage-label" />
        </button>
      </div>
    </form>
  );
}
