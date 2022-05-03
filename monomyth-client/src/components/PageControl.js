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
`

const PageBtn = styled.button`
  border: gray solid 1px;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1.5rem;
  height: 3rem;
  width: 3rem;
  background-color: #333;
  color: #eee;
  cursor: pointer;
  visibility: ${props => props.shown ? 'visible' : 'hidden'}; // 'Previous' btn hidden on first page
  box-shadow:
    .25rem .5rem 1rem rgba(0, 0, 0, 0.3),
    0 0 1.5rem rgba(0, 0, 0, .2);
`

const PageControl = (props) => {

  const onNextPageClick = (e) => {
    e.preventDefault();

    const newPage = props.page + 1;
    props.setPage(newPage);
  }

  const onPreviousPageClick = (e) => {
    e.preventDefault();

    const newPage = props.page - 1;
    props.setPage(newPage);
  }

  return (
    <ControllerForm>
      <PageBtn shown={props.page} onClick={onPreviousPageClick}>ᐊ</PageBtn>
      <PageNumber>Page {props.page + 1}</PageNumber>
      <PageBtn shown={true} onClick={onNextPageClick}>ᐅ</PageBtn>
    </ControllerForm>
  )
}

export default PageControl