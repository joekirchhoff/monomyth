import Comment from '../components/Comment';
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Routes, Route } from "react-router-dom";

describe('Comment - matched author, not liked', () => {
  
  const comment = {
    _id: '123',
    text: 'This is a test comment!',
    author: {
      _id: '123456789',
      username: 'fakeAuthor'
    },
    likes: [
      '456'
    ],
    score: 1,
    date: new Date(0)
  }
  const currentUser = {_id: '123456789'};
  const storyID = '98765431';

  function TestComment() { 
    return render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <Comment 
            key={comment._id}
            comment={comment}
            currentUser={currentUser}
            storyID={storyID}
          />
        } />
      </Routes>
    </BrowserRouter>
    );
  }

  it('Render comment text', () => {
    const {getByText} = TestComment();
    const commentParagraph = screen.getByText('test', {exact: false});
    expect(commentParagraph.textContent).toBe('This is a test comment!');
  })

  it('Render author link as username', () => {
    const {getByRole} = TestComment();
    const authorLink = screen.getByRole('link');
    expect(authorLink.textContent).toBe('fakeAuthor');
  })

  it('Render like button if comment not liked by user', () => {
    const {getByRole} = TestComment();
    const likeBtn = screen.getByTitle('Like');
    expect(likeBtn).toBeTruthy();

  })

  it('Render edit button if user is author', () => {
    const {getByRole} = TestComment();
    const editBtn = screen.getByRole('button', {name: 'Edit'});
    expect(editBtn).toBeTruthy();
  })

  it('Click edit button reveals edit form', () => {
    const {getByRole} = TestComment();
    const editBtn = screen.getByRole('button', {name: 'Edit'});

    userEvent.click(editBtn);

    const textarea = screen.getByRole('textbox');
    expect(textarea.value).toBe('This is a test comment!');
  })
});

describe('Comment - not author, already liked', () => {
  
  const comment = {
    _id: '123',
    text: 'This is a test comment!',
    author: {
      _id: '456',
      username: 'fakeAuthor'
    },
    likes: [
      '123456789'
    ],
    score: 1,
    date: new Date(0)
  }
  const currentUser = {_id: '123456789'};
  const storyID = '98765431';

  function TestComment() { 
    return render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <Comment 
            key={comment._id}
            comment={comment}
            currentUser={currentUser}
            storyID={storyID}
          />
        } />
      </Routes>
    </BrowserRouter>
    );
  }

  it('Render comment text', () => {
    const {getByText} = TestComment();
    const commentParagraph = screen.getByText('test', {exact: false});
    expect(commentParagraph.textContent).toBe('This is a test comment!');
  })

  it('Render author link as username', () => {
    const {getByRole} = TestComment();
    const authorLink = screen.getByRole('link');
    expect(authorLink.textContent).toBe('fakeAuthor');
  })

  it('Render unlike button if comment already liked by user', () => {
    const {getByRole} = TestComment();
    const unlikeBtn = screen.getByTitle('Unlike');
    expect(unlikeBtn).toBeTruthy();
  })

  it('Does not render edit button if user is not author', () => {
    const {queryByRole} = TestComment();
    expect(screen.queryByRole('button', {name: 'Edit'})).toBeNull();
  })
});
