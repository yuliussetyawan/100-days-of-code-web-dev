const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentsSectionElement = document.getElementById("comments");
const commentsFormElement = document.querySelector("#comments-form form");
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");

function createCommentsList(comments) {
  const commentListElement = document.createElement("ol");

  for (const comment of comments) {
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
      <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.text}</p>
      </article>
    `;
    commentListElement.appendChild(commentElement);
  }

  return commentListElement;
}

async function fetchCommentsForPost() {
  const postId = loadCommentsBtnElement.dataset.postid;
  try {
    const response = await fetch(`/posts/${postId}/comments`);
    if (!response.ok) {
      alert("Fetching comments failed");
      return
    }
    const responseData = await response.json();

    if (responseData && responseData.length > 0) {
      const commentsListElement = createCommentsList(responseData);
      commentsSectionElement.innerHTML = "";
      commentsSectionElement.appendChild(commentsListElement);
    } else {
      commentsSectionElement.firstElementChild.textContent =
        "We could not find any comments. Maybe add one?";
    }
  } catch (error) {
    alert("Getting comments failed!");
  }
}

// prepare POST request data without reloading
async function saveComment(e) {
  e.preventDefault();
  const postId = commentsFormElement.dataset.postid;
  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;
  const comment = { title: enteredTitle, text: enteredText };

  // try catch for handle technical error e.g user is offline
  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      // When sending data to a web server, the data has to be a string.
      body: JSON.stringify(comment),
      headers: {
        // add metadata to the outgoing request
        "Content-Type": "application/json",
      },
    });
    // handle server side error
    if (response.ok) {
      fetchCommentsForPost();
    } else {
      alert("Could not send comment");
    }
  } catch (error) {
    alert("Could not send the request - maybe try again later!");
  }
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);
commentsFormElement.addEventListener("submit", saveComment);
