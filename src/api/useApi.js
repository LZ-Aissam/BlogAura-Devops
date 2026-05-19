export function useApi(apiFn, arg = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const exec = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFn(arg);
        setData(res);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    exec();
  }, [arg]);

  return { data, loading, error };
}
