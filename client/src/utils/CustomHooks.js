import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

export const useInfiniteScroll = callback => {
  const [isFetching, setIsFetching] = useState(false);
  const [movedSinceFetch, setMovedSinceFetch] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [movedSinceFetch, isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  const handleScroll = debounce(() => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    if (!isFetching && movedSinceFetch && windowBottom >= docHeight) {
      setIsFetching(true);
      setMovedSinceFetch(false);
    }

    if (!movedSinceFetch && windowBottom < docHeight) {
      setMovedSinceFetch(true);
    }
  }, 100);

  return [isFetching, setIsFetching];
};
