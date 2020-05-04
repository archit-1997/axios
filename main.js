//AXIOS GLOBALS
axios.defaults.headers.common['X-AUTH-TOKEN'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'


// GET REQUEST
function getTodos() {
    //Long way of making the get request from axios
    // axios({
    //     method: 'get',
    //     url: 'https://jsonplaceholder.typicode.com/todos',
    //     params: {
    //         _limit: 5
    //     }
    // })
    //     .then(res => showOutput(res))
    //     .catch(err => console.log(err))
    //No need of get method. This will become a get request by default
    axios
        .get('https://jsonplaceholder.typicode.com/todos?_limit=5', { timeout: 5000 })
        .then(res => showOutput(res))
        .catch(err => console.log(err))

}

// POST REQUEST
function addTodo() {
    axios
        .post('https://jsonplaceholder.typicode.com/todos', {
            title: 'New Todo',
            completed: false
        })
        .then(res => showOutput(res))
        .catch(err => console.log(err))
}

//PUT is used to update the entire resource
//PATCH is used to update the resource
//Whenever we make any PUT or DELETE request, we need to know which todo we are dealing with,
//so here we need to include the id with the url
// PUT/PATCH REQUEST
function updateTodo() {
    // axios
    //     .put('https://jsonplaceholder.typicode.com/todos/1', {
    //         title: 'Updated Todo',
    //         completed: true
    //     })
    //     .then(res => showOutput(res))
    //     .catch(err => console.log(err))
    axios
        .patch('https://jsonplaceholder.typicode.com/todos/1', {
            title: 'New Todo',
            completed: false
        })
        .then(res => showOutput(res))
        .catch(err => console.log(err))
}

// DELETE REQUEST
function removeTodo() {
    axios
        .delete('https://jsonplaceholder.typicode.com/todos/1')
        .then(res => showOutput(res))
        .catch(err => console.log(err))
}

// SIMULTANEOUS DATA
function getData() {
    axios.all([
        axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
        axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
    ])
        // .then(res => {
        //     console.log(res[0])
        //     console.log(res[1])
        //     showOutput(res[1])
        // })
        //instead of all this, we can just use axios.spread
        .then(axios.spread((todos, posts) => showOutput(posts)))
        .catch(err => console.log(err))
}

// CUSTOM HEADERS
function customHeaders() {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'sometoken'
        }
    }

    axios
        .post('https://jsonplaceholder.typicode.com/todos', {
            title: 'New Todo',
            completed: false
        }, config)
        .then(res => showOutput(res))
        .catch(err => console.log(err))
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
    const options = {
        method: 'post',
        url: 'https://jsonplaceholder.typicode.com/todos',
        data: {
            title: 'Hello World !!'
        },
        transformResponse: axios.defaults.transformResponse.concat(data => {
            data.title = data.title.toUpperCase()
            return data
        })
    }

    axios(options)
        .then(res => showOutput(res))
}

// ERROR HANDLING
function errorHandling() {
    axios
        .get('https://jsonplaceholder.typicode.com/todoss', {
            validateStatus: function (status) {
                return status < 500 //Reject only if status id greater or equal to 500
            }
        })
        .then(res => showOutput(res))
        .catch(err => {
            if (err.response) {
                //Server responded with a status other than 200
                console.log(err.response.data)
                console.log(err.response.status)
                console.log(err.response.headers)

                if (err.response.status === 404) {
                    alert('Error 404 : Page not found')
                }
            }
            else if (err.request) {
                //Request was made but no response
                console.log(err.request)
            }
            else {
                console.log(err.message)
            }
        })
}

// CANCEL TOKEN
//This allows us to cancel requests on the fly
function cancelToken() {

    const source = axios.CancelToken.source()

    axios
        .get('https://jsonplaceholder.typicode.com/todos', {
            cancelToken: source.token
        })
        .then(res => showOutput(res))
        .catch(thrown => {
            if (axios.isCancel(thrown)) {
                console.log('Request Cancelled', thrown.message)
            }
        })

    if (true) {
        source.cancel('Request Cancelled')
    }
}

// INTERCEPTING REQUESTS & RESPONSES
//This is like creating logger for any requests
//We have access to config like the methods or the urls and other stuff like that
axios.interceptors.request.use(config => {
    console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`)

    return config
},
    error => {
        return Promise.reject(error)
    }
)

// AXIOS INSTANCES
const axiosInstance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com'
})

axiosInstance
    .get('/comments')
    .then(res => showOutput(res))


// Show output in browser
function showOutput(res) {
    document.getElementById('res').innerHTML = `
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
    .getElementById('transform')
    .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);