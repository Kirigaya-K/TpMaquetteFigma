console.log("Début Console.");

let form =  document.querySelector(".todoForm");
// let tr = document.querySelector("table");
// let deleteTr = document.querySelectorAll(".deleteTr");

document.addEventListener("submit", function(event)
	{
		event.preventDefault();

		const urlParams = new URLSearchParams(window.location.search);
		const itemId = urlParams.get("id");
		let items = JSON.parse(localStorage.getItem("items")) || [];
		const completed = parseInt(event.target.fulfillment.value);

		const itemData = 
			{
				id: itemId ? parseInt(itemId) : Date.now(),
				task: event.target.task.value,
				description: event.target.description.value,
				category: event.target.category.value,
				when: event.target.when.value,
				time: event.target.time.value,
				priority: event.target.priority.value,
				completed: (completed !== 100) ? false : true,
				fulfillment: event.target.fulfillment.value,
			}
		
		if (itemId)
			{
				items = items.map(item => 
						(item.id === parseInt(itemId) ? itemData : item));
			}
		else
			{
				items.push(itemData);
			}

		localStorage.setItem("items", JSON.stringify(items));

		/*console.log("valers du completed " + itemData.completed)
		console.log("valers du fulfillment " + typeof completed)*/

		event.target.reset();
		alert("Element ajouté !");

		window.location.href = "index.html";

		/*let formData = new FormData(form);
		let name = formData.get("task");
		let description = formData.get("description");
		let category = formData.get("category");
		let when = formData.get("when");
		let time = formData.get("time");
		let priority = formData.get("priority");
		let accomplissement = formData.get("accomplissement");

		let newTr = document.createElement("tr");
		
		tr.appendChild(newTr);
		newTr.innerText = 'texxxxttttt'

		console.log(name);*/
	});

document.addEventListener("DOMContentLoaded", function()
	{
		const container = document.querySelector(".container");
		const template = document.querySelector(".item-template");
		const todOptions = document.querySelectorAll(".todoDiv button");
		const annuler = document.querySelector(".removeLS");

		// const fulfillmentBar = document.querySelector("#fulfillment-bar");
		const fulfillmentSlider = document.querySelector("#fulfillment");	
		const progressValue = document.querySelector("#progress-value");

		const urlParams = new URLSearchParams(window.location.search);
		const currentItemId = urlParams.get("id");

		if(form)
			{
				fulfillmentSlider.addEventListener("input", function()
					{
						const value = parseInt(fulfillmentSlider.value);
						// fulfillmentBar.value = value;
						progressValue.textContent = `${value}%`;

						if(currentItemId)
							{
								let items = JSON.parse(localStorage.getItem("items")) || [];
								const itemIndex = items.findIndex(item => item.id === parseInt(currentItemId));

								if(itemIndex > -1)
									{
										items[itemIndex].completed = (value === "100");
										items[itemIndex].fulfillment = value;

										localStorage.setItem("items", JSON.stringify(items));
									}
							}
					});

				annuler.addEventListener("click", e => 
					{
						localStorage.removeItem("items");
					});
			}

		if (template)
			{
				function loadFilterItemsFromLS(filter)
					{
						const items = JSON.parse(localStorage.getItem("items")) || [];
						container.innerHTML = "";

						items.forEach(itemData =>
							{
								if((filter === "all") ||
									(filter === "todo" && !itemData.completed) ||
									(filter === "completed" && itemData.completed))
									{
										const row = template.content.cloneNode(true).querySelector("tr");

										if(row)
											{
												row.setAttribute("data-id", itemData.id);

												row.querySelector(".item-task").textContent = itemData.task;
												row.querySelector(".item-description").textContent = itemData.description;
												row.querySelector(".item-category").textContent = itemData.category;
												row.querySelector(".item-when").textContent = itemData.when;
												// row.querySelector(".item-time").textContent = itemData.time;
												row.querySelector(".item-priority").textContent = itemData.priority;
												row.querySelector(".item-fulfillment").textContent = `${itemData.fulfillment}%`;

												container.appendChild(row);
											}
										else
											{
												console.error("Erreur : Impossible de trouver tr");
											}
									}
							});
					}

					loadFilterItemsFromLS("all");

					document.querySelectorAll(".todOption").forEach(button =>
						{
							button.addEventListener("click", function()
								{
									const filter = button.getAttribute("data-filter");
									loadFilterItemsFromLS(filter);
								});
						});
			}

		if (container)
			{
				container.addEventListener("click", function(event)
					{
						if(event.target.classList.contains("deleteTr"))
							{
								const row = event.target.closest("tr");
								const itemId = row.getAttribute("data-id");

								row.remove();


								let items = JSON.parse(localStorage.getItem("items")) || [];
								items = items.filter(item => item.id !== parseInt(itemId));

								localStorage.setItem("items", JSON.stringify(items));
							}

						if(event.target.classList.contains("update"))
							{
								const row = event.target.closest("tr");
								const itemId = row.getAttribute("data-id");

								window.location.href = `form.html?id=${itemId}`;
							}
					});
			}

		if (todOptions)
			{
				todOptions.forEach(button =>
					{
						button.addEventListener("click", function()
							{
								// alert("btn!")
								todOptions.forEach(btn => btn.classList.remove("active"));
								button.classList.add("active");
							});
					});
			}

	});

document.addEventListener("DOMContentLoaded", function()
	{
		// const fulfillmentBar = document.querySelector("#fulfillment-bar");
		// const progressValue = document.querySelector("#progress-value");
		const fulfillmentSlider = document.querySelector("#fulfillment");	

		const urlParams = new URLSearchParams(window.location.search);
		const currentItemId = urlParams.get("id");

		if(currentItemId)
			{
				const items = JSON.parse(localStorage.getItem("items")) || [];
				const itemToEdit = items.find(item => item.id === parseInt(currentItemId));

				if (itemToEdit)
					{
						document.querySelector("[name='task']").value = itemToEdit.task;
						document.querySelector("[name='description']").value = itemToEdit.description;
						document.querySelector("[name='category']").value = itemToEdit.category;
						document.querySelector("[name='when']").value = itemToEdit.when;
						document.querySelector("[name='time']").value = itemToEdit.time;
						
						const prioritySelect = document.querySelector("[name='priority']");
						
						if(prioritySelect)
							{
								const optionSelect = prioritySelect.querySelector(`option[value="${itemToEdit.priority}"]`);

								if(optionSelect)
									{ prioritySelect.value = itemToEdit.priority; }
								else
									{ console.warn("La valeur de priority n'éxiste pas !"); }
							}

						fulfillmentSlider.value = itemToEdit.fulfillment;
						// fulfillmentBar.value = itemToEdit.fulfillment;
						// progressValue.textContent = `${itemToEdit.fulfillment}%`;
					}
			}
	});






/*deleteTr.forEach(button =>
	{
		button.addEventListener("click", function()
			{
				const row = button.closest("tr");
				if(row)
					{
						row.remove();
					}
			});
	});*/

/*function addItemToLocalStorage(itemData)
	{
		let items = JSON.parse(localStorage.getItem("newElements")) || [];
		items.push(itemData);

		localStorage.setItem("newElements", JSON.stringify(items));
	}

addItemToLocalStorage(itemData);

functionb addItemFromLocalStorage()
	{
		const items = JSON.parse(localStorage.getItem("newElements"));

		if(items)
			{
				items.forEach(item => 
					{
						const element = document.createElement
					})

				const template = document.querySelector(".item-template").content.cloneNode(true);
				template.querySelector(".item-task").tectContent = itemData.text;

				document.querySelector(".container").appendChild(template);

				// localStorage.removeItem("newElementData");
			}
	}*/