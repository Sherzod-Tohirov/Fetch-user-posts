const fragment = new DocumentFragment();
const elUserTemp = document.querySelector('.js-user-temp');
const elUserList = document.querySelector('.js-user-list');
const elPostList = document.querySelector('.js-post-list');
const elPostTemp = document.querySelector('.js-post-temp');
const elCommentList = document.querySelector('.js-comment-list');
const elCommentTemp = document.querySelector('.js-comment-temp');
let elPostBtns;
let elCommentBtns;
async function getUsersData(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderUsers(data, elUserList);        
    }catch(e) {
        console.log(e);
    }
}   


function renderUsers(data, node) {
    node.innerHTML = '';

    data.forEach(item => {
        const temp = elUserTemp.content.cloneNode(true);
        if(item.phone.includes('x')) {
            item.phone = item.phone.substr(0, item.phone.indexOf('x'));
        }
        item.phone = '+' + item.phone.split('').filter(item => !isNaN(item)).join('');
        temp.querySelector('.js-name').textContent = item.name;
        temp.querySelector('.js-id').textContent = item.id;
        temp.querySelector('.js-username').textContent = item.username;
        temp.querySelector('.js-email').textContent = item.email;
        temp.querySelector('.js-email').href = `mailto:${item.email}`;
        temp.querySelector('.js-address').textContent = `${item.address?.city}, ${item.address?.street}`;
        temp.querySelector('.js-zipcode').textContent = item.address?.zipcode;
        temp.querySelector('.js-tel').textContent = item.phone;
        temp.querySelector('.js-tel').href = `tel:${item.phone}`;
        temp.querySelector('.js-website').href = item.website;
        temp.querySelector('.js-location').href = `http://www.google.com/maps/place/${item.address?.geo.lat},${item.address?.geo.lng}`;
        temp.querySelector('.js-company').textContent = item.company?.name;
        temp.querySelector('.js-job-desc').textContent = item.company?.catchPhrase;
        temp.querySelector('.js-details').textContent = item.company?.bs;
        temp.querySelector('.js-post-btn').dataset.id = item.id;

        fragment.appendChild(temp);

    });

    node.appendChild(fragment);
}


async function getPostsData(url, userId) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderPosts(data, elPostList, userId);
    }catch(e) {
        console.log(e);
    }
}   


function renderPosts(data, node, userId) {
    
    let counter = 1;
    data = data.filter(item => item.userId == userId);
    node.innerHTML = '';
    data.forEach(item => {
        
        const temp = elPostTemp.content.cloneNode(true);

        temp.querySelector('.js-post-id').textContent = counter;
        temp.querySelector('.js-post-title').textContent = item.title;
        temp.querySelector('.js-post-body').textContent = item.body;
        temp.querySelector('.js-comment-btn').dataset.id = item.id;
        fragment.appendChild(temp);
        ++counter;

    });
    node.appendChild(fragment);
}

async function getCommentsData(url, postId) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderComments(data, elCommentList, postId);
    }catch(e) {
        console.log(e);
    }
}   


function renderComments(data, node, postId) {
    
    let counter = 1;
    data = data.filter(item => item.postId == postId);
    node.innerHTML = '';
    data.forEach(item => {
        
        const temp = elCommentTemp.content.cloneNode(true);

        temp.querySelector('.js-comment-id').textContent = counter;
        temp.querySelector('.js-comment-email').textContent = item.email;
        temp.querySelector('.js-comment-email').href = `mailto:${item.email}`;
        temp.querySelector('.js-comment-title').textContent = item.name;
        temp.querySelector('.js-comment-body').textContent = item.body;
        fragment.appendChild(temp);
        ++counter;

    });
    node.appendChild(fragment);
}

// Fetch users data 

getUsersData("https://jsonplaceholder.typicode.com/users");



// Fetch post data if button clicks 

   const postHandler =  setInterval(() => {
        elPostBtns = document.querySelectorAll('.js-post-btn');
        if(elPostBtns.length != 0) {
            elPostBtns.forEach(btn => {
                btn.addEventListener('click', (evt) => {
                    elCommentList.innerHTML = '';
                    getPostsData("https://jsonplaceholder.typicode.com/posts", btn.dataset?.id);
                    fetchComments();
                });
            });
            clearInterval(postHandler);
        }
    }, 500);

// Fetch Comments if post button clicks 
  
  function fetchComments() {
    const commentHandler = setInterval(() => {
        elCommentBtns = document.querySelectorAll('.js-comment-btn');
        if(elCommentBtns.length != 0) {
            elCommentBtns.forEach(btn => {
                
                btn.addEventListener('click', (evt) => {
                    getCommentsData("https://jsonplaceholder.typicode.com/comments", btn.dataset?.id);
                    
                });
            });
            clearInterval(commentHandler);
        }
      }, 1000);
    
  }

  fetchComments();
   
