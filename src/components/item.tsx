import { take, takeLast } from 'ramda';
import { fromUnixTime, format } from 'date-fns';
import {route} from 'preact-router'

interface Creator {
  name: string;
  handle: string;
  avatar: string;
}

interface AssetProps {
  creator?: Creator;
  id?: string;
  title?: string;
  groupId?: string | null;
  height?: string | number;
  timestamp?: string | number;
  stamps?: number;
}

const shortHash = (h: string) => `${take(5, h)}...${takeLast(5, h)}`;

const Asset = ({
  creator = {
    name: 'Rakis',
    handle: '@rakis',
    avatar: 'https://arweave.net:443/fYmFNZbRCbPhBWqmOJLNiJFoLFiFchIBSZNI6jRwWaI',
  },
  id = '',
  title = 'Asset Discoverability - ANS-110',
  groupId = null,
  height = 'pending',
  timestamp = 'pending',
  stamps = 0,
}: AssetProps) => {
  const date =
    typeof timestamp === 'number' && timestamp > 0
      ? format(fromUnixTime(Number(timestamp)), 'M/d/yyyy')
      : 'pending';

  return (
    <div className="pt-4 border-b-2 border-black-500 hover:bg-gray-100" onClick={() => route(`/remix/${id}`)}>
      <div className="py-2 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Uncomment if you want to use avatar
            <img
              className="rounded-full h-14 w-14 border border-slate-50"
              src={creator.avatar}
              alt=""
            /> */}
            <div className="flex items-center space-x-1">
              {/* Uncomment if you want to display creator details
              <div>
                <h1 className="font-bold text-primary font-mono">{creator.name}</h1>
              </div>
              <p className="text-gray-400">{creator.handle}</p>
              <span style={{ fontSize: '6px' }}>
                <i className="fa fa-circle text-gray-600" />
              </span>
              */}
              <h1 className="pl-2 md:pl-8 text-xl text-primary">
                {title} {groupId ? `(${groupId})` : ''}
              </h1>
            </div>
          </div>
          <div>
            <a className="btn btn-sm btn-ghost float-right btn-primary" href={`/view/${id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex mt-2 space-x-10 text-gray-500 place-content-end">
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://viewblock.io/arweave/tx/${id}`}
            className="link mt-2"
          >
            <span className="hidden md:block flex items-end">{shortHash(id)}</span>
          </a>
          <span className="flex items-end">Stamps: ({stamps})</span>
          <span className="flex space-x-2 items-end">
            Date: {date}
          </span>
          <span className="flex space-x-2 items-end">Height: {height}</span>
        </div>
      </div>
    </div>
  );
};

export default Asset;
