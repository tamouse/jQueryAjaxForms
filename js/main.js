const API_URL = 'http://localhost:33333/contacts';

// Handle the Form Submission
//
// @param data - the serialized form data
// @param result - callback to run on sucessful result
function handleSubmit(data, result) {
    console.log("dirty data: ", data);
    data = data.map(function (item) {
        item.value = item.value
            .replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;');
        return item;
    });
    console.log("cleaned data: ", data);

    // The jQuery ajax call starts with the object containing
    // the information needed to make the call, then there are
    // "chained" methods that respond to the completed promises.
    //
    // When the ajax function completes successfully, the .done()
    // function runs, calling the result callback with the data
    // returned.
    //
    // If the ajax function fails for some reason, the .fails()
    // function runs, logging out the error.
    //
    // This ajax call is the one that Posts the form data
    // to the server.
    jQuery
        .ajax({
            url: API_URL,
            data: data,
            method: 'POST'
        })
        .done(function (data) {
            console.log("Data returned: ", data);
            result(data);
        })
        .fail(function (data) {
            console.error("Failed: returning: ", data);
        })
}

function getContacts() {
    // This ajax call retrieves the full list of contacts
    // from the server and displays them.
    jQuery
        .ajax({
            url: API_URL,
            method: 'GET'
        })
        .done(function (data) {
            console.log("Success. data returned: ", data);
            showContacts(data);
        })
        .fail(function (data) {
            console.error("Failed. data returned: ", data);
        })
}

// formatting function to display the contact object
function formatContact(contact) {
    let output = '';
    output += `<li id="contact-${contact.id}">`;
    output += `${contact.name} &lt;${contact.email}&gt;`;
    output += ' ';
    // truncating just in case someone enters in ten million characters
    output += `<small>${contact.bio.substr(0, 50)}</small>`;
    output += '</li>';
    return output;
}

// Shows the Contact list in the browser
//
// @param contacts - array of the contacts
function showContacts(contacts) {

    // getting the display element and initialize it's contents
    const contactsDisplay = $('#contactsList');
    contactsDisplay.html('<p>Loading ...</p>');

    // create the display of the contacts by turning
    // each contact in the list into an html list item
    const contactList = contacts
        .map(formatContact)
        .join('');

    // replace the loading message with the actual contact list
    contactsDisplay.html(contactList);
}

// running this only after the document is ready
$(function () {
    const form = $('#the-form');

    // set up the submit event handler for the form
    form.on('submit', function (event) {
        event.preventDefault(); // because we don't want it to go anywhere else

        // passing in the serialized form data as an array;
        // ('this' in the event handler refers to the form.)
        handleSubmit($(this).serializeArray(), getContacts);
    });

    // Initialize the display
    getContacts();
});
