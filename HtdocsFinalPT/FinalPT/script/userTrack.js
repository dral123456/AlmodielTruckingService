$(document).ready(() => {
    
        console.log("Button clicked, starting AJAX request.");

        $.ajax({
            url: "../../database/userQueue.php",
            type: "GET",
            dataType: 'json', 
            cache: false,
            success: (response) => {
            console.log("Full Response:", response);

            if (response.status === "success") {
                console.log("Data successfully retrieved. Locations found:", response.data.length);
                console.log(response.data);
                
                // Clear existing rows
                $("#locationsTable tbody").empty();
                
                // Loop through response data and append rows
                response.data.forEach(location => {
                    const row = `
                    <tr class="clickable-row" data-id="${location.id}">
                        <td>${location.client_name}</td>
                        <td>${location.date}</td>
                        <td>${location.pickup}</td>
                        <td>${location.destination}</td>
                    </tr>   
                    `;
                    $("#locationsTable tbody").append(row);
                });

            } else {
                console.error("Server reported an application error:", response.error);
                alert("Retrieving data error: " + (response.error || "Unknown Application Error"));
            }
        },

            error: (xhr, status, error) => {
                // This is the handler for network/parsing failures (like the "parsererror")
                const rawResponse = xhr.responseText.trim();
                
                console.error("AJAX Error Details:", {
                    httpStatus: xhr.status, 
                    jQueryStatus: status, // This will be "parsererror"
                    errorText: error,
                    rawResponse: rawResponse.substring(0, 100) + '...' // Show beginning of response
                });
                
                if (status === "parsererror") {
                    alert("Parsing Error! Response is corrupted. Check PHP files for stray output or errors.");
                } else {
                    alert(`Server Error occurred! Status: ${xhr.status} (${error})`);
                }
            }
        });

        $(document).on("click", ".clickable-row", function() {
                const id = $(this).data("id");
                // Example: navigate to details page
                window.location.href = `../userPages/trackDelivery.html?id=${id}`;
            });
        
        
});