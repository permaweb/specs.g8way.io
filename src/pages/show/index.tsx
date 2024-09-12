import useShowService from './service'
import { useEffect, useMemo, useState } from "preact/hooks"
import Loading from '../../components/loading'
import { route } from "preact-router"
import { take, takeLast } from "ramda"
import { format, fromUnixTime } from "date-fns"
const shortHash = (h: string) => `${take(5, h)}...${takeLast(5, h)}`

const ShowPage = ({ tx, parent = false }: { tx: string, parent?: boolean }) => {
  const [showError, setShowError] = useState<boolean>(false)
  const s = useShowService()
  const send = s[1]
  const context = useMemo(() => {
    if (s[0].context?.error) {
      setShowError(true)
    }
    return s[0].context
  }, [s])

  const current = useMemo(() => {
    return s[0].name
  }, [s])

  useEffect(() => {
    send({ type: 'load', tx })
  })
  
  const handleStamp = () => {
    send('stamp')
  }

  const handleReset = async () => {
    send('reset')
    route("/", true)
  }

  return (
    <>
      {current === 'loading' ? (
        <Loading open={true} />
      ) : current === 'ready' || current === 'doStamp' ? (
        <div className="drawer drawer-end">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <Loading open={current === 'doStamp'} />
            <div className="flex md:mt-8 px-4">
              <div className="flex flex-col flex-1">
                <div className="flex w-full justify-between">
                  <h3 className="text-2xl text-[#ff8500] mb-8">Specification</h3>
                  <nav className="flex py-4 px-4 sticky top-0 items-center justify-between">
                    {!parent && (
                      <>
                        <button className="btn btn-outline" onClick={handleStamp}>
                          stamp ({context?.spec?.stamps})
                        </button>
                        <label for="my-drawer-2" className="btn btn-ghost text-lg drawer-button">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </label>
                      </>
                    )}
                  </nav>
                </div>

                <div className={`prose prose-invert lg:prose-xl spec-width ${!parent ? 'max-w-full' : 'mx-8'}`}>
                  <div dangerouslySetInnerHTML={{ __html: context?.spec?.html }} />
                </div>
              </div>
            </div>
          </div>
          <div className="drawer-side">
            <label for="my-drawer-2" className="drawer-overlay" />
            <div className="menu bg-base-100 block h-screen">
              <div className="py-2 space-y-3 sticky top-0 w-[400px]">
                <div className="card">
                  <div className="card-body">
                    <div className="card-title">Information</div>
                    <h4 className="text-xl">{context?.spec?.Title}</h4>
                    <p className="break-normal">{context?.spec?.Description}</p>
                    <table className="table table-compact">
                      <tbody>
                        <tr>
                          <th>ID</th>
                          <td>{shortHash(tx)}</td>
                        </tr>
                        <tr>
                          <th>GroupId</th>
                          <td>{context?.spec?.GroupId}</td>
                        </tr>
                        {context?.spec?.Forks && (
                          <tr>
                            <th>Forks</th>
                            <td>{shortHash(context.spec.Forks)}</td>
                          </tr>
                        )}
                        <tr>
                          <th>Topics</th>
                          <td>{context?.spec?.Topics}</td>
                        </tr>
                        <tr>
                          <th>Stamps</th>
                          <td>{context?.spec?.stamps}</td>
                        </tr>
                        <tr>
                          <th>Height</th>
                          <td>{context?.spec?.height}</td>
                        </tr>
                        <tr>
                          <th>Date</th>
                          <td>
                            {context?.spec?.timestamp > 0
                              ? format(fromUnixTime(context.spec.timestamp), 'M/d/yyyy')
                              : 'pending'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <div className="card-title">Actions</div>
                    <button className="btn btn-sm btn-outline" onClick={handleStamp}>STAMP</button>
                    <a href={`/related/${tx}`} className="btn btn-sm btn-outline">View Related</a>
                    <a href={`/remix/${tx}`} className="btn btn-sm btn-outline">Remix</a>
                    <a href={`https://microscope.g8way.io/?tx=${tx}`} className="btn btn-sm btn-outline">Microscope</a>
                    <button className="btn btn-sm btn-outline" onClick={handleReset}>Home</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <input type="checkbox" id="error-modal" checked={showError} className="modal-toggle" onChange={() => setShowError(!showError)} />
      {showError && (
        <div className="modal">
          <div className="modal-box w-[300px] px-8 py-16 mx-4 space-y-8">
            {context?.error && (
              <>
                <h3 className="text-xl text-error">Error(s)</h3>
                <div className="text-sm">{context?.error?.message}</div>
              </>
            )}
            <button
              className="btn btn-outline btn-block btn-error"
              onClick={() => {
                send('reset')
                setShowError(false)
              }}
            >
              close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ShowPage