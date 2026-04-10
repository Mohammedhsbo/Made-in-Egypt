import { useEffect, useState } from "react";
import api from "../api/axios.base";

export default function useRelatedProducts(id) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchRelated = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/product/related/${id}`);

        setData(res.data.data.products || res.data.data || []);
      } catch (err) {
        console.log(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [id]);

  return { data, loading, error };
}