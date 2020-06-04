import {useState, useEffect} from 'react';
import * as api from './api';
//-------------------------------------

export const useApiFetchData = ({resource, id, options}) => {
  const [response, setResponse] = useState(null);
  const [isFetched, setFetched] = useState(false);

  const refetch = async params => {
    if (id === null) {
      return;
    }
    setFetched(false);
    let reso = resource;
    if (id) reso += `/${id}`;
    if (params) reso += '?';
    if (params?.page) reso += `&page=${params.page}`;
    if (params?.per_page) reso += `&per_page=${params.per_page}`;

    let res = await api.getResourceData(reso);
    if (res) {
      setResponse(res);
    }
    setFetched(true);
  };

  useEffect(() => {
    const getData = async () => {
      if (id === null) {
        setFetched(true);
        return;
      }
      let reso = resource;
      if (id) reso += `/${id}`;
      if (options) reso += '?';
      if (options?.page) reso += `&page=${options.page}`;
      if (options?.per_page) reso += `&per_page=${options.per_page}`;

      let res = await api.getResourceData(reso);
      if (res) {
        setResponse(res);
      }
      setFetched(true);
    };
    getData();
  }, []);

  return [response, response?.data, isFetched, refetch];
};
