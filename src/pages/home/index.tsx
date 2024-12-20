import { useState, useMemo } from 'preact/hooks'
import Sidebar from '../../components/sidebar'
import Item from '../../components/item'
import useHomeService from './service'
import LearnPage from '../learn'
import ShowPage from '../show'
import Loading from '../../components/loading'


const HomePage = () => {
  const [showError, setShowError] = useState(false)
  const [showVouchModal, setShowVouchModal] = useState(false)
  const [copying, setCopying] = useState(false)
  
  const s = useHomeService()

  const send = s[1]
  const context = useMemo(() => {
    if (s[0].context?.error) {
      if (s[0].context.error.message === 'Not Vouched') {
        setShowVouchModal(true)
      } else {
        setShowError(true)
      }
    }
    return s[0].context
  }, [s])

  const current: string = useMemo(() => {
    return s[0].name
  }, [s])


  const handleCopy = () => {
    setCopying(true)
    setTimeout(() => setCopying(false), 2000)
    const spec = `${window.location.origin}/?tx=${context.selected?.id}`
    window.navigator.clipboard.writeText(spec)
  }

  const handleStamp = () => {
    send('stamp')
  }

  return (
    <div className="drawer drawer-mobile lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-start">
        <div className="w-full md:w-4/5 border-l border-r border-slate-300 min-h-screen">
          <nav className="flex py-4 px-4 sticky top-0 bg-white border-b border-slate-300 items-center justify-between lg:justify-end z-10">
            {current !== 'view' && current !== 'stamping' && current !== 'learn' ? (
              <>

                <label htmlFor="my-drawer-2" className="btn btn-ghost text-lg drawer-button lg:hidden">
                  <span className="text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                </label>

                <a href="/create" className="btn btn-ghost btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </a>
              </>
            ) : current === 'view' || current === 'stamping' ? (
              <>
                <button className="btn btn-ghost" onClick={() => send('back')}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                {current === 'stamping' ? (
                  <span>Stamping...</span>
                ) : (
                  <div className="flex space-x-2 items-center">
                    <span className="line-clamp-1">{`${window.location.origin}/?tx=${context.selected?.id}`}</span>
                    <button className="btn btn-sm btn-ghost" onClick={handleCopy}>
                      {copying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                      )}
                    </button>
                    <button className="btn btn-outline btn-primary" onClick={handleStamp}>
                      Stamp ({context.selected?.stamps})
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button className="btn btn-ghost" onClick={() => send('back')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
          </nav>

          {current === 'loading' ? (
            <Loading open={true} />
          ) : current === 'ready' ? (
            <div className="overflow-hidden">
              {context.specs?.map((item) => (
                <Item key={item.id} {...item} onClick={() => send({ type: 'show', selected: item })} />
              ))}
            </div>
          ) : current === 'view' || current === 'stamping' ? (
            <ShowPage tx={context.selected?.id} parent={true} />
          ) : current === 'learn' ? (
            <LearnPage />
          ) : null}
        </div>
      </div>
      <div className="drawer-side">
        <Sidebar
          onBack={() => send('back')}
          onClick={() => send('learn')}
          current={current}
          tx={context?.selected?.id}
        />
      </div>
      <input type="checkbox" id="error-modal" checked={showError} className="modal-toggle" onChange={() => setShowError(!showError)} />
      {showError && (
        <div className="modal">
          <div className="modal-box w-[300px] px-8 py-16 mx-4 space-y-8">
            {context?.error && (
              <>
                <h3 className="text-xl text-error">Error(s)</h3>
                <div className="text-sm">{context.error.message}</div>
              </>
            )}
            <button className="btn btn-outline btn-block btn-error" onClick={() => {
              send('reset')
              setShowError(false)
            }}>
              close
            </button>
          </div>
        </div>
      )}
      <input type="checkbox" id="vouch-modal" checked={showVouchModal} className="modal-toggle" onChange={() => setShowVouchModal(!showVouchModal)} />
      {showVouchModal && (
        <div className="modal">
          <div className="modal-box w-[600px] px-8 py-8 mx-4 space-y-8">
            <h3 className="text-xl">You are not vouched!</h3>
            <div className="text-md">You must be vouched to stamp Specs.</div>
            <button
              className="btn btn-outline btn-block"
              onClick={() => {
                window.open('https://vouch-portal.arweave.net/#/intent/vouch-goal?value=2&currency=USD&profileId=L3jAPxvy_3GnFCS_TYVPpfqdw7usO5QsDzDNZmIFVg8&appLink=https%3A%2F%2Fspecs.arweave.net%2F', '_blank')
                send('reset')
                setShowVouchModal(false)
              }}
            >
              get vouched
            </button>
            <button
              className="btn btn-outline btn-block"
              onClick={() => {
                send('reset')
                setShowVouchModal(false)
              }}
            >
              close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage