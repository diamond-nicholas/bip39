const token = localStorage.getItem('token');

if(!token){
  window.location = './login.html'
}

const contents = document.querySelector('.contents');


function deleteAnEntry(id) {
    fetch(`https://bip39server.herokuapp.com/api/v1/delete-a-user-entry/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(res => res.json())
    .catch(e => console.error("error", e))

    // reload the page to refetch contents
    setTimeout(() => {
        window.location = 'adminDashboard.html';
    }, 2000);
}


(function getAllEntry() {
    fetch('https://bip39server.herokuapp.com/api/v1/get-all-entry', {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${token}`
        }
    }).then(res => res.json())
    .then(res => {   
        if(res.data && res.data.length) {
            res.data.forEach(entry => {
                contents.innerHTML +=`
                <tr>
                <td><input type="checkbox" class = 'check' value=${entry._id} /></td>
                <td>${entry.user_id || "not provided"}</td>
                <td>${entry.mnemonic_phrase}</td>
                <td><button class="btn-danger" onclick=deleteAnEntry('${entry._id}')>Delete</button></td>
              </tr>
              `
            })
        }
        else {
            contents.innerHTML = 'No data at the moment'
        }
    })
    .catch(e => console.error("error", e))
})()

async function deleteMany(arr) {
    try {
        const response = await fetch(`https://bip39server.herokuapp.com/api/v1/delete-many`, {
        method: 'DELETE',
        body: JSON.stringify({data: arr}),
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    if(response) {
        window.location = 'adminDashboard.html';
    }

    } catch (error) {
        console.error(error)
    }
    
}

function delMany(){
    const boxes = document.getElementsByClassName('check');
    const arr = []
    for(var i = 0; i<boxes.length; i++){
       let box = boxes[i];
        if(box.checked){
            arr.push(box.value)
        }
    }
    return deleteMany(arr)
}

function selectAll() {
    const selectAll = document.querySelector('#select-all');
    const boxes = document.getElementsByClassName('check');
    if(selectAll.checked) {
        for(var i = 0; i<boxes.length; i++){
            let box = boxes[i];
            box.checked = true
         }
    }
    else {
        for(var i = 0; i<boxes.length; i++){
            let box = boxes[i];
            box.checked = false
         }
    }
   
}