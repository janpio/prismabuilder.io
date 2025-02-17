import Link from "next/link";
import Modal from "./Modal";
import Schema from "./Schema";
import { Button, Separator, Card } from "@prisma/lens";
import { ID_FIELD } from "../lib/fields";
import { Layers } from "react-feather";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../lib/context";
import { useState } from "react";
import toast from "react-hot-toast";
import { Model } from "../lib/types";

export default function Models() {
  const { schema, setSchema } = useSchemaContext();
  const router = useRouter();

  const [showingSchema, setShowingSchema] = useState<boolean>(false);

  return (
    <div className="flex flex-col border flex-1 max-w-sm h-screen overflow-y-auto p-4 space-y-3 bg-gray-100">
      <div className="flex flex-col space-y-3 flex-1">
        {schema.models.map((model: Model, i: number) => (
          <Link href={`/models/${i}`} key={model.name}>
            <a>
              <Card className="border border-transparent hover:border-blue-500 cursor-pointer transition flex items-center space-x-3">
                <Layers size={20} className="text-gray-500" />
                <h3>{model.name}</h3>
              </Card>
            </a>
          </Link>
        ))}

        {schema.models.length ? <Separator /> : null}

        <Button
          onClick={() => {
            if (schema.models.some((model: Model) => model.name === "New")) {
              toast.error("A model called New already exists");
            } else {
              const newSchema = {
                ...schema,
                models: [
                  ...schema.models,
                  {
                    name: "New",
                    fields: [ID_FIELD],
                    enums: [],
                  },
                ],
              };
              setSchema(newSchema);
              router.push(`/models/${newSchema.models.length - 1}`);
            }
          }}
          variant="secondary"
        >
          New model
        </Button>

        {schema.models.length ? (
          <Button
            onClick={() => {
              setShowingSchema(true);
            }}
          >
            Generate schema
          </Button>
        ) : null}

        {showingSchema && (
          <Modal
            onClose={() => setShowingSchema(false)}
            open={showingSchema}
            heading="Schema"
          >
            <Schema />
          </Modal>
        )}
      </div>

      <div className="divide-x text-sm text-gray-600 justify-self-end">
        <a
          className="hover:underline hover:text-gray-700 pr-3"
          href="https://albingroen.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Creator
        </a>

        <a
          href="https://github.com/albingroen/prismabuilder.io"
          className="hover:underline hover:text-gray-700 pl-3"
          rel="noopener noreferrer"
          target="_blank"
        >
          Source code
        </a>
      </div>
    </div>
  );
}
