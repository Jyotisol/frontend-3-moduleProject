const currentIp = localStorage.getItem("currentIp");
        console.log(currentIp);
        let latitude;
        let longitude;
        let pincode;

        async function getIPDetails() {
            // api = https://ipinfo.io/${IP}/geo
            try {
                let response = await fetch(`https://ipinfo.io/${currentIp}?token=30dd7efacbc702`);
                let result = await response.json();

                const coordinate = result.loc;
                let arr = coordinate.split(",");
                latitude = parseFloat(arr[0]);
                longitude = parseFloat(arr[1]);

                //IP Details
                let ipContainer = document.getElementById("ip");
                ipContainer.innerText += currentIp;
                let lat = document.getElementById("lat");
                lat.innerText += latitude;
                let long = document.getElementById("long");
                long.innerText += longitude;
                let city = document.getElementById("city");
                city.innerText += result.city;
                let org = document.getElementById("org");
                org.innerText += result.org;
                let region = document.getElementById("region");
                region.innerText += result.region;
                let hostname = document.getElementById("hostname");
                hostname.innerText += result.hostname;
                pincode = parseInt(result.postal);

                updateMap();
            } catch (error) {
                console.error('Error fetching IP details:', error);
            }
        }

        getIPDetails();

        function updateMap() {
            // "https://maps.google.com/maps?q=35.856737, 10.606619&z=15&output=embed"
            const map = document.getElementsByTagName("iframe")[0];
            map.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

            postOfficeDetails();
        }

        async function postOfficeDetails() {
            // https://api.postalpincode.in/pincode/${pincode} - where ${pincode}
            try {
                let response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                let result = await response.json();

                let details = result[0];
                updateMoreInfo(details);

                displayPostOffice(details.PostOffice);
            } catch (error) {
                console.error('Error fetching post office details:', error);
            }
        }

        function updateMoreInfo(details) {
            let timeZone = new Date().toLocaleString("en-US", { timeZone: details.Timezone });
            let pin = document.getElementById("pinCode");
            pin.innerText += pincode;
            let msg = document.getElementById("message");
            msg.innerText += details.Message;
            let time = document.getElementById("time");
            time.innerText += timeZone;
        }

        function displayPostOffice(postOfficeArr) {
            let container = document.getElementById("postOfficeList");
            let innerContent = "";
            let n = postOfficeArr.length;

            for (let i = 0; i < n; i++) {
                let postoffice = postOfficeArr[i];
                let content = `<div class="postOffice-card">
                    <p>Name ${postoffice.Name}</p>
                    <p>Branch Type ${postoffice.BranchType}</p>
                    <p>Delivery Status ${postoffice.DeliveryStatus}</p>
                    <p>District ${postoffice.District}</p>
                    <p>Division ${postoffice.Division}</p>
                </div>`;
                innerContent += content;
            }

            container.innerHTML = innerContent;
        }