import { Option, program } from "commander";
import admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
import { Submission } from "../src/submission";

admin.initializeApp({
  credential: applicationDefault(),
});

program
  .command("set-questions")
  .description("Sets the number of questions")
  .argument("<number>", "Number of questions")
  .action(async (number: number) => {
    await admin.firestore().doc("config/main").set({ numberOfQuestions: number }, { merge: true });
  });

program
  .command("allow-submit")
  .description("Allows users to submit")
  .action(async () => {
    await admin.firestore().doc("config/main").set({ canAnswer: true }, { merge: true });
  });

program
  .command("block-submit")
  .description("Disallow users to submit")
  .action(async () => {
    await admin.firestore().doc("config/main").set({ canAnswer: false }, { merge: true });
  });

program
  .command("set-title <title>")
  .description("Set the title of the form")
  .action(async (title: string) => {
    await admin.firestore().doc("config/main").set({ title }, { merge: true });
  });

program
  .command("add-announcement <title> <content>")
  .addOption(
    new Option("-s, --severity <severity>", "Severity of the announcement")
      .choices(["info", "warning", "danger"])
      .makeOptionMandatory(true)
  )
  .description("Add a new announcement")
  .action(async (title: string, content: string, options: { severity: string }) => {
    await admin
      .firestore()
      .doc("config/main")
      .update({
        announcements: admin.firestore.FieldValue.arrayUnion({
          time: admin.firestore.Timestamp.now(),
          title,
          content,
          severity: options.severity,
        }),
      });
  });

program
  .command("get-submissions")
  .description("Fetches the submissions as JSON")
  .option("-f, --follow")
  .action(async ({ follow }: { follow: boolean }) => {
    const unsubscribe = admin
      .firestore()
      .collection("submissions")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type !== "added") return;
          const { answers, time, token, uid } = change.doc.data() as Submission;
          console.log(
            JSON.stringify({
              token,
              time: time.toDate().toISOString(),
              answers,
              uid,
            })
          );
        });
        if (!follow) process.exit();
      });

    await new Promise(() => {}); // wait forever

    process.on("beforeExit", unsubscribe);
  });

program.parse();
