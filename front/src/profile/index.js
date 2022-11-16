import { addClass, dateFormatter, getProfile, removeClass, session } from '../util.js';
import '../initExit.js';
import '../initMenu.js';

const postTemplate = document.querySelector('template[data-template="post"]');

const wallWrapper = document.querySelector('[data-segment="wall"]');

const fields = document.querySelectorAll('[data-field]');
const addFriendButton = document.querySelector('[data-action="addFriend"]');
const removeFriendButton = document.querySelector('[data-action="removeFriend"]');
const removeRequestButton = document.querySelector('[data-action="removeRequest"]');
const startChatButton = document.querySelector('[data-action="startChat"]');
const postTextarea = document.querySelector('[data-field="postEditor"]');
const sentPostButton = document.querySelector('[data-action="sendPost"]');

let user = null;
let profile = null;

main();

async function main() {
  profile = await session();

  const params = new URLSearchParams(location.search);

  if (params.has('userId')) {
    user = await getProfile(parseInt(params.get('userId')));
  } else if (profile) {
    user = await getProfile(parseInt(profile.id));
  } else {
    return (location.href = '/');
  }

  initProfile();
  initWall(user.posts);
}

function initProfile() {
  let { user: userField, request, friend } = user;

  for (const field of fields) {
    const fieldName = field.dataset.field;

    if (fieldName === 'name') {
      const name = `${userField.name} ${userField.surname}`;
      field.textContent = name;
      document.title = name;
    } else if (fieldName === 'status') {
      field.textContent = userField.status;
    } else if (fieldName === 'avatar') {
      field.src = userField.img;
    } else if (fieldName === 'postEditor') {
      console.log({ field });
      field.addEventListener('input', (e) => {
        console.log('value', e.target.value);
        if (!e.target.value.trim().length) {
          sentPostButton.disabled = true;
        } else {
          sentPostButton.disabled = false;
        }
      });
    }

    if (request && profile && profile.id != userField.id) {
      removeClass(removeRequestButton, 'd-none');
      removeRequestButton.addEventListener('click', removeRequest);
    }

    if (profile != null ? friend && profile && profile.id != userField.id : false) {
      removeClass([removeFriendButton, startChatButton], 'd-none');
      removeFriendButton.addEventListener('click', removeFriend);
      startChatButton.addEventListener('click', () => {
        document.location = `/chat.html?userId=${user.user.id}`;
      });
    }

    if (profile != null ? !request && !friend && profile.id != userField.id : false) {
      removeClass(addFriendButton, 'd-none');
      addFriendButton.addEventListener('click', addFriend);
    }

    sentPostButton.addEventListener('click', sendPost);

    if (profile != null ? (profile != null && profile.id === userField.id) || friend : false) {
      if (!sentPostButton.disabled) {
        sentPostButton.disabled = true;
      }

      if (fieldName === 'postEditor') {
        field.value = '';
        field.disabled = false;
      }
    }
  }
}

async function addFriend() {
  try {
    const res = await fetch(`/api/request/${user.user.id}`, { method: 'POST' });

    if (res.ok) {
      location.reload();
      return;
    }

    const text = await res.json();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert(err.message);
  }
}

async function removeRequest() {
  try {
    const res = await fetch(`/api/revoke/${user.user.id}`, { method: 'POST' });

    if (res.ok) {
      location.reload();
      return;
    }

    const text = await res.json();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert(err.message);
  }
}

async function removeFriend() {
  try {
    const res = await fetch(`/api/friend/${user.user.id}`, { method: 'DELETE' });

    if (res.ok) {
      location.reload();
      return;
    }

    const text = await res.json();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert(err.message);
  }
}

async function sendPost() {
  const content = postTextarea.value.trim();

  if (!content.length) {
    return;
  }

  try {
    const res = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        userId: user.user.id,
      }),
    });

    if (res.ok) {
      main();
      return;
    }

    const text = await res.text();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert(err.message);
  }
}

function createPost(postContent) {
  const template = document.importNode(postTemplate.content, true);
  const fields = template.querySelectorAll('[data-field]');
  const deletePostButton = template.querySelector('[data-action="delete"]');
  const editPostButton = template.querySelector('[data-action="edit"]');
  const likeButton = template.querySelector('[data-action="like"]');
  const likeButtonIcon = likeButton.firstElementChild;

  for (const field of fields) {
    const fieldType = field.dataset.field;
    const linkToProfile = `/profile.html?userId=${postContent.user.id}`;

    if (fieldType === 'avatar') {
      field.src = postContent.user.img;
    } else if (fieldType === 'name') {
      field.textContent = `${postContent.user.name} ${postContent.user.surname}`;
      field.href = linkToProfile;
    } else if (fieldType === 'date') {
      field.textContent = dateFormatter.format(postContent.createdAt);
    } else if (fieldType === 'content') {
      field.textContent = postContent.content;
    } else if (fieldType === 'profileLink') {
      field.href = linkToProfile;
    } else if (fieldType === 'id') {
      field.dataset.postId = postContent.id;
    }

    if (profile.id === user.user.id || profile.id === postContent.user.id) {
      removeClass(deletePostButton, 'd-none');
    }

    if (profile.id === postContent.user.id) {
      removeClass(editPostButton, 'd-none');
    }
  }

  // work with like button
  removeClass(likeButton, 'btn-outline-primary');
  removeClass(likeButtonIcon, 'bi-hand-thumbs-up-fill');

  if (postContent.liked || postContent.likes) {
    removeClass(likeButtonIcon, 'bi-hand-thumbs-up');
    addClass(likeButtonIcon, 'bi-hand-thumbs-up-fill');
    likeButtonIcon.textContent = ' ' + postContent.likes;
  }

  if (postContent.liked) {
    removeClass(likeButton, 'btn-outline-secondary');
    addClass(likeButton, 'btn-outline-primary');
  }

  return template;
}

function initWall(posts) {
  const postItems = posts.map(createPost);

  postItems.forEach(initPost);

  wallWrapper.textContent = '';
  wallWrapper.append(...postItems);
}

function initPost(post) {
  const likeButton = post.querySelector('[data-action="like"]');
  const deleteButton = post.querySelector('[data-action="delete"]');
  const editButton = post.querySelector('[data-action="edit"]');

  likeButton.addEventListener('click', toggleLike);
  deleteButton.addEventListener('click', removePost);
  editButton.addEventListener('click', startEditorPost);

  return post;
}

async function toggleLike(e) {
  const post = e.target.closest('[data-post-id]');
  const postId = post.dataset.postId;

  try {
    const res = await fetch(`/api/liketoggle/${postId}`, { method: 'POST' });

    if (res.ok) {
      const nextPost = await res.json();
      const newPost = createPost(nextPost);

      initPost(newPost);
      post.replaceWith(newPost);

      const prevPost = user.posts.find((el) => el.id === nextPost.id);
      Object.assign(prevPost, nextPost);

      return;
    }

    const text = await res.text();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert({ err });
  }
}

async function removePost(e) {
  const isDelete = confirm('Вы действительно хотите удалить пост');

  if (!isDelete) {
    return;
  }

  const post = e.target.closest('[data-post-id]');
  const postId = post.dataset.postId;

  try {
    const res = await fetch(`/api/post/${postId}`, { method: 'DELETE' });

    if (res.ok) {
      user.posts = user.posts.filter((el) => el.id !== postId);
      return post.remove();
    }

    const text = await res.text();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert({ err });
  }
}

function startEditorPost(e) {
  const post = e.target.closest('[data-post-id]');
  const postId = parseInt(post.dataset.postId, 10);
  const postContentInfo = user.posts.find((el) => el.id === postId).content;

  console.log({ user });

  console.log({ postContentInfo });

  const postActions = post.querySelector('[data-segment="actions"]');
  const postEditorSegment = post.querySelector('[data-segment="editor"]');
  const postTextarea = post.querySelector('[data-field="editor"]');
  const postContent = post.querySelector('[data-field="content"]');
  const postSaveButton = post.querySelector('[data-action="save"]');

  addClass([postActions, postContent], 'd-none');
  removeClass(postEditorSegment, 'd-none');

  postTextarea.focus();
  postTextarea.value = postContentInfo;
  postSaveButton.addEventListener('click', savePost);
}

async function savePost(e) {
  const post = e.target.closest('[data-post-id]');
  const content = post.querySelector('[data-field="editor"]').value.trim();

  if (!content.length) {
    alert('Нельзя сохранить пустой пост!');
    return;
  }

  const postId = post.dataset.postId;

  try {
    const res = await fetch(`/api/post/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const nextPost = await res.json();
      const newPost = createPost(nextPost);

      initPost(newPost);
      post.replaceWith(newPost);

      const prevPost = user.posts.find((el) => el.id === nextPost.id);
      Object.assign(prevPost, nextPost);

      return;
    }
  } catch (err) {
    console.error({ err });
    alert({ err });
  }
}
