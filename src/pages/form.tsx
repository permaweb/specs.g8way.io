import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import EasyMDE from "easymde";
import { trim } from "ramda";
import useFormService from "./formService";
import '../index.css'
import { route } from "preact-router"
import { d } from "robot3"

interface SpecMeta {
  GroupId: string;
  Title: string;
  Description: string;
  Topics: string;
  Authors: string;
  Forks: string;
  Variant?: string;
}

interface Props {
  tx?: string | null;
}

const EditorComponent: preact.FunctionComponent<Props> = ({ tx }) => {
  const [editor, setEditor] = useState<EasyMDE | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFM, setShowFM] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState('');
  const [context, setContext] = useState<any>({});

  const [specMeta, setSpecMeta] = useState<SpecMeta>({
    GroupId: "",
    Title: "",
    Description: "",
    Topics: "",
    Authors: "",
    Forks: "",
  });

  const s = useFormService();
  const send = s[1]


  useEffect(() => {
    setCurrent(s[0].name);
    setContext(s[0].context);

    if (s[0].context?.error) {
      setShowError(true);
    }
  }, [s]);

  useEffect(() => {
    if (context?.error) {
      setShowError(true);
    }
  }, [context]);

  useEffect(() => {
    const editorInstance = new EasyMDE({
      element: document.getElementById("editor") as HTMLTextAreaElement,
      minHeight: "85vh",
      autoFocus: true,
      spellChecker: false,
      indentWithTabs: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "|",
        "link",
        "table",
        "code",
        "|",
        "preview",
        "side-by-side",
        "|",
        {
          name: "metadata",
          action: () => setShowFM(true),
          className: "fa fa-gear",
          text: "Metadata ",
          title: "Metadata Editor",
        },
        {
          name: "publish",
          action: () => {
            setShowPublish(true);
            setShowFM(true);
          },
          className: "fa fa-cloud-upload",
          text: "Publish ",
          title: "Publish Spec",
        },
        {
          name: "cancel",
          action: () => {
            send("reset");
            route("/");
          },
          className: "fa fa-ban",
          text: "Cancel ",
          title: "Cancel Spec",
        },
      ],
    });
    setEditor(editorInstance);
    editorInstance.value("");
    send({ type: "init", tx });
  }, [send, tx]);

  const updateMetadata = async () => {
    setShowFM(false);
    if (showPublish) {
      setShowPublish(false)
      console.log('publishing...', { specMeta})
      send({
        type: "save",
        md: editor?.value(),
        metadata: {
          ...specMeta,
          Topics: specMeta.Topics.length > 0 ? specMeta.Topics.split(",").map(trim) : [],
          Authors: specMeta.Authors.length > 0 ? specMeta.Authors.split("\n").map(trim) : [],
        },
      });
    }
  };

  useEffect(() => {
    if (current === "ready" && !showFM && !loaded) {
      setLoaded(true);
      setSpecMeta({
        Title: context.spec.Title,
        GroupId: context.spec.GroupId,
        Description: context.spec.Description,
        Topics: context.spec.Topics.length > 0 ? context.spec.Topics.join(", ") : "",
        Authors: context.spec.Authors.length > 0 ? context.spec.Authors.join("\n") : "",
        Forks: tx || "",
        Variant: context.spec?.Variant || "",
      });

      if (editor?.value() === "") {
        setTimeout(() => editor?.value(context.spec.body), 100);
      }
    }
    if (current === "confirm") {
      setShowConfirm(true);
    }
  }, [current, context, editor, loaded, showFM, tx]);

  return (
    <div class="py-8 mx-8">
      <h1 class="text-primary font-mono text-2xl">SPEC Editor</h1>

      <textarea id="editor" />

      {showError && (
        <div class="modal modal-open">
          <div class="modal-box mx-4 space-y-8">
            {context?.error?.issues && (
              <>
                <h3 class="text-xl text-error">Error(s)</h3>
                <ul class="flex-col items-start space-y-2">
                  {context.error.issues.map((issue: any) => (
                    <li key={issue.id}>{`error with "${issue.path[0]}" ${issue.message}`}</li>
                  ))}
                </ul>
              </>
            )}
            {context?.error?.message && <div class="text-sm">{context.error.message}</div>}
            <button
              class="btn btn-outline btn-block btn-error"
              onClick={() => {
                send("reset");
                setShowError(false);
              }}
            >
              close
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div class="modal modal-open">
          <div class="modal-box mx-4 space-y-8">
            <h3 class="text-xl text-success">Success!</h3>
            <div class="py-8">
              <p>
                SPEC is successfully published to the Permaweb, it may take a few moments to show
                up in the list as the decentralized network and indexes complete processing the
                document.
              </p>
            </div>
            <button class="btn btn-outline btn-block btn-error" onClick={() => {
              // TODO: route to homepage
            }}>
              ok
            </button>
          </div>
        </div>
      )}

      {showFM && (
        <div class="modal modal-open">
          <div class="modal-box mx-4 space-y-8">
            <button
              onClick={() => {
                setShowFM(false);
                setShowPublish(false);
              }}
              class="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>
            {current === "ready" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateMetadata();
                }}
              >
                <div class="form-control">
                  <label class="label">Name *</label>
                  <input
                    name="groupId"
                    class="input input-bordered"
                    placeholder="Name of Protocol"
                    value={specMeta.GroupId}
                    onInput={(e) =>
                      setSpecMeta((prev) => ({ ...prev, GroupId: (e.target as HTMLInputElement).value }))
                    }
                    required
                  />
                </div>
                <div class="form-control">
                  <label class="label">Variant *</label>
                  <input
                    name="variant"
                    class="input input-bordered"
                    placeholder="Variant or Version of Specification"
                    value={specMeta.Variant}
                    onInput={(e) =>
                      setSpecMeta((prev) => ({ ...prev, Variant: (e.target as HTMLInputElement).value }))
                    }
                    required
                  />
                </div>
                <div class="form-control">
                  <label class="label">Title *</label>
                  <input
                    name="title"
                    class="input input-bordered"
                    placeholder="Spec Title"
                    value={specMeta.Title}
                    onInput={(e) =>
                      setSpecMeta((prev) => ({ ...prev, Title: (e.target as HTMLInputElement).value }))
                    }
                    required
                  />
                </div>
                <div class="form-control">
                  <label class="label">Description *</label>
                  <textarea
                    name="description"
                    class="textarea textarea-bordered"
                    placeholder="spec description"
                    value={specMeta.Description}
                    onInput={(e) =>
                      setSpecMeta((prev) => ({
                        ...prev,
                        Description: (e.target as HTMLTextAreaElement).value,
                      }))
                    }
                    required
                  />
                </div>
                <div class="form-control">
                  <label class="label">Topics</label>
                  <input
                    name="topics"
                    class="input input-bordered"
                    placeholder="list of topics"
                    value={specMeta.Topics}
                    onInput={(e) =>
                      setSpecMeta((prev) => ({ ...prev, Topics: (e.target as HTMLInputElement).value }))
                    }
                  />
                </div>
                <div class="form-control">
                  <label class="label">Authors</label>
                  <textarea
                    name="authors"
                    class="textarea textarea-bordered"
                    placeholder="place each authors wallet address on a separate line"
                    value={specMeta.Authors}
                    onInput={(e) =>
                      setSpecMeta((prev) => ({
                        ...prev,
                        Authors: (e.target as HTMLTextAreaElement).value,
                      }))
                    }
                  />
                </div>
                {specMeta.Forks && (
                  <div class="form-control">
                    <label class="label">Forks</label>
                    <input
                      name="forks"
                      class="input input-bordered"
                      placeholder="forks TX"
                      value={specMeta.Forks}
                      disabled
                    />
                  </div>
                )}
                <div class="mt-8">
                  {showPublish ? (
                    <button class="btn btn-block">Publish</button>
                  ) : (
                    <button class="btn btn-block btn-info">Update Metadata</button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorComponent;
