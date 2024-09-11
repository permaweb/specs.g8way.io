import { useEffect, useState } from "preact/hooks"
import useRelatedService from "./relatedService"
import SidebarMenu from "../components/sidebar-related"
import Item from '../components/item';       // Create this component
import Loading from '../components/loading';       // Create this component

const RelatedPage = ({ tx }: { tx: string }) => {
  const [current, setCurrent] = useState('');
  const [context, setContext] = useState<any>({});

  const s = useRelatedService()
  const send = s[1]

  useEffect(() => {
    setCurrent(s[0].name)
    setContext(s[0].context)
  }, [s]);

  useEffect(() => {
    if (current === 'idle' || current === '') {
      send({ type: 'load', tx })
    }
  })
  // TODO: add item type
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
              {context?.specs?.map((item: any) => (
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