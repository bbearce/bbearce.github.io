
// Build arr from database
arr = []
Code_Database.forEach(function(elem){
    record = {}
    record.id = elem.pk
    record.parentid = elem.fields.parentid
    record.title = elem.fields.title
    record.details = elem.fields.details
    record.code = elem.fields.code
    record.date = new Date(elem.fields.date)
    record.level = elem.fields.level
    record.language = elem.fields.language
    arr.push(record)
})
// delete fake database
// var arr = [
//     {id: 1, title: 'Python', parentid: 0, 'code':'None'},
//     {id: 2, title: 'Python Category 1', parentid: 1, 'code':'None'},
//     {id: 3, title: 'Python Category 2', parentid: 2, 'code':'None'},
//     {id: 4, title: 'Python Code Example', parentid: 3, 'code':'print("Hello World")'}
//     ]
    
// Find all content which is at the bottom of the tree
var arr_ids = [...arr.keys()].map(function(val){return ++val;});
var parent_ids = [...new Set(arr.map(function(val){return val.parentid;}))]
var content_ids = new Set(
    arr_ids.filter(x => !parent_ids.includes(x))
)

// Function to build navbar from database
function appendChildren(node){
    // Find navbar root
    root = document.getElementById('Dropdown'+node.parentid)

    if(parent_ids.includes(node.id) && node.parentid === 0){
        // parent button
        var child = document.createElement('button')
        child.id = 'Dropdown'+node.id
        child.classList.add('dropdown-btn')
        child.innerHTML = node.title
        var caret = document.createElement('i')
        caret.classList.add("fa")
        caret.classList.add("fa-caret-down")
        child.appendChild(caret)
        root.appendChild(child)

        // children
        var dropdown = document.createElement('div')
        dropdown.classList.add('dropdown-container')
        root.appendChild(dropdown)
    }else if(parent_ids.includes(node.id)){
        // parent button
        var child = document.createElement('button')
        child.id = 'Dropdown'+node.id
        child.classList.add('dropdown-btn')
        child.innerHTML = node.title
        var caret = document.createElement('i')
        caret.classList.add("fa")
        caret.classList.add("fa-caret-down")
        child.appendChild(caret)
        root.nextElementSibling.appendChild(child)

        // children
        var dropdown = document.createElement('div')
        dropdown.classList.add('dropdown-container')
        root.nextElementSibling.appendChild(dropdown)

    }else{
        var child = document.createElement('a')
        child.innerHTML = node.title
        child.onclick = function(){showCodeEntry(node.id)}
        root.nextElementSibling.appendChild(child)


    }
}

// Build navbar from database
for(i in arr){appendChildren(arr[i])}

// When content link is clicked, show that content
function showCodeEntry(node_id){
    
    var post = arr.filter(x => x.id === node_id)[0]

    document.getElementById('title').innerHTML = post.title;
    // Grab  elements and process changes
    var code_element = document.getElementById('code')
    code_element.innerHTML = post.code
    code_element.style.display = '';
    
    var details_element = document.getElementById('details')
    
    // details_element.appendChild('p')
    details_element.innerHTML = post.details

    var date_element = document.getElementById('date')
    var date = new Date(post.date)
    
    date_element.innerHTML = (date.getMonth()+1).toString()+'-'+date.getDate().toString()+'-'+date.getFullYear().toString()

    // Rerun Prism syntax highlighting on the current page
    Prism.highlightAll();

}

// Watch all dropdowns; skip pid=0 as that is the sidebar nav div

var buttons = [...document.getElementsByClassName('dropdown-btn')]
buttons.forEach(function(elem){
    elem.addEventListener("click",function(){
        elem.classList.toggle("active");
        if(elem.nextElementSibling.style.display === 'block'){
            elem.nextElementSibling.style.display = 'none'
        }else{
            elem.nextElementSibling.style.display = 'block'
        }
    })
})

