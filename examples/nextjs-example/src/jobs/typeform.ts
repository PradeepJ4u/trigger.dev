import { client } from "@/trigger";
import { Typeform, events } from "@trigger.dev/typeform";
import { Job, eventTrigger } from "@trigger.dev/sdk";
import { DynamicTrigger } from "@trigger.dev/sdk";

export const typeform = new Typeform({
  id: "typeform-1",
  token: process.env.TYPEFORM_API_KEY!,
});

new Job(client, {
  id: "typeform-playground",
  name: "Typeform Playground",
  version: "0.1.1",
  integrations: {
    typeform,
  },
  trigger: eventTrigger({
    name: "typeform.playground",
  }),
  run: async (payload, io, ctx) => {
    await io.typeform.listForms("list-forms");

    if (payload.formId) {
      const form = await io.typeform.getForm("get-form", {
        uid: payload.formId,
      });

      const listResponses = await io.typeform.listResponses("list-responses", {
        uid: payload.formId,
        pageSize: 50,
      });

      const allResponses = await io.typeform.getAllResponses(
        "get-all-responses",
        {
          uid: payload.formId,
        }
      );
    }
  },
});

new Job(client, {
  id: "typeform-webhook-2",
  name: "Typeform Webhook 2",
  version: "0.1.1",
  trigger: typeform.onFormResponse({
    uid: "QQnotGJM",
    tag: "tag3",
  }),
  run: async (payload, io, ctx) => {},
});

const dynamicTrigger = new DynamicTrigger(client, {
  id: "typeform-dynamic-trigger",
  source: typeform.source,
  event: events.onFormResponse,
});