import styled from 'styled-components';

const ControllerForm = styled.form`
  margin: 2rem auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`

const PageNumber = styled.p`
  padding: 1rem;
  user-select: none;
`

const PageBtn = styled.button`
  border: ${props => props.theme.borderMain};
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1.5rem;
  height: 3rem;
  width: 3rem;
  background-color: ${props => props.theme.bgMainColor};
  color: ${props => props.theme.textMainColor};
  cursor: pointer;
  visibility: ${props => props.shown ? 'visible' : 'hidden'}; // 'Previous' btn hidden on first page
  box-shadow: ${props => props.theme.boxShadowMain};
`

const PageControl = (props) => {

  const onNextPageClick = (e) => {
    e.preventDefault();
    props.setPage(props.page + 1);
    window.scrollTo(0, 0)
  }

  const onPreviousPageClick = (e) => {
    e.preventDefault();
    props.setPage(props.page - 1);
    window.scrollTo(0, 0)
  }

  return (
    <ControllerForm>
      <PageBtn
        shown={props.page}
        onClick={onPreviousPageClick}
        aria-label='Previous Page'
        title='Previous Page'
      >
        ᐊ
      </PageBtn>
      <PageNumber>Page {props.page + 1}</PageNumber>
      <PageBtn
        shown={props.nextStoriesCount}
        onClick={onNextPageClick}
        aria-label='Next Page'
        title='Next Page'
      >
        ᐅ
      </PageBtn>
    </ControllerForm>
  )
}

export default PageControl