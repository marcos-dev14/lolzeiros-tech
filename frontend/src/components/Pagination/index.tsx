import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';

import { Container, ChangePageButton, PageButton } from './styles';

interface Props {
  currentPage: number;
  lastPage: number;
  setCurrentPage: Function;
  style?: CSSProperties;
}

export function Pagination({
  currentPage,
  lastPage,
  setCurrentPage,
  style = {}
}: Props) {
  const [basePages, setBasePages]  = useState<number[]>([]);
  const [indexPages, setIndexPages]  = useState<number[]>([]);
    
  useEffect(() => {
    const pagesArr = Array(lastPage).fill(1).map((_, index) => index + 1);
    const splicedPagesArr = Array(lastPage).fill(1).map((_, index) => index + 1).splice(currentPage - 1, 5);
    setBasePages(pagesArr);
    setIndexPages(splicedPagesArr);
  }, [currentPage,lastPage]);
  
  const { currentFirstPage, currentLastPage } = useMemo(() => ({
    currentFirstPage: indexPages[0],
    currentLastPage: indexPages[indexPages.length - 1],
  }), [indexPages]);

  const handlePrevPage = useCallback(() => {
    if(currentPage === currentFirstPage) {
      setIndexPages(basePages.slice(currentPage - 2, currentPage + 3))
    }

    setCurrentPage(currentPage - 1) 
  }, [basePages, currentFirstPage, currentPage, setCurrentPage]);

  const handleNextPage = useCallback(() => {
    if(currentPage === currentLastPage)
      setIndexPages(basePages.slice(currentPage - 4, currentPage + 1))
    
    setCurrentPage(currentPage + 1);
  }, [currentPage, basePages, currentLastPage, setCurrentPage]);

  return (
    <Container style={style}>
      <ChangePageButton
        className="left"
        onClick={() => setCurrentPage(1)}
      >
        Primeira
      </ChangePageButton>
      <PageButton
        disabled={currentPage === 1}
        onClick={handlePrevPage}  
        selected={false}
      >
        ←
      </PageButton>
      {indexPages.map(p => (
        <PageButton
          key={p}
          onClick={() => setCurrentPage(p)}
          selected={currentPage === p}
        >
          {p}
        </PageButton>
        ))
      }
       <PageButton
        onClick={() => handleNextPage()}
        disabled={currentPage === lastPage}
        selected={false}
      >
        →
      </PageButton>
      <ChangePageButton
        className="right"
        onClick={() => setCurrentPage(lastPage)}
      >
        Última
      </ChangePageButton>
    </Container>
  );
}
