import { useEffect, useMemo } from "preact/hooks"
import useRelatedService from "./service"
import SidebarMenu from "../../components/sidebar-related"
import Item from '../../components/item'
import Loading from '../../components/loading'

const RelatedPage = ({ tx }: { tx: string }) => {
  const s = useRelatedService()
  const send = s[1]

  const context = useMemo(() => {
    return s[0].context
  }, [s])

  const current = useMemo(() => {
    return s[0].name
  }, [s])

  useEffect(() => {
    if (current === 'idle' || current === '') {
      send({ type: 'load', tx })
    }
  })
  return (    
    <div class="drawer drawer-mobile  lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col items-center justify-start">
        <div class="w-full md:w-4/5 border-l border-r border-slate-300 min-h-screen">
          <nav class="flex py-4 px-4 sticky top-0 border-b border-slate-300 items-center justify-between">
            <label for="my-drawer-2" class="btn btn-ghost text-lg drawer-button">
              <span class="text-primary">Related Versions</span>
            </label>
          </nav>
          {current === 'loading' ? (
            <Loading open={true} />
          ) : current === 'ready' ? (
            <div class="overflow-hidden">
              {context?.specs?.map((item) => (
                <Item key={item.id} {...item} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div class="drawer-side">
        <SidebarMenu tx={tx} />
      </div>
    </div>
  )
}


export default RelatedPage