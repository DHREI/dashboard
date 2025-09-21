document.addEventListener('DOMContentLoaded', () => {
        const links = document.querySelectorAll('.sidebar a');
        const panels = document.querySelectorAll('.dashboard-panel');
        const doctorsTableBody = document.getElementById('doctors-table-body');
        const doctorImageFileInput = document.getElementById('doctor-image-file-input');
        const addNewDoctorBtn = document.getElementById('add-new-doctor');
        const commentsTableBody = document.getElementById('comments-table-body');
        const addNewCommentBtn = document.getElementById('add-new-comment');

        // Best Doctors specific elements
        const doctorsListView = document.getElementById('doctors-list-view');
        const editDoctorView = document.getElementById('edit-doctor-view');
        const editDoctorForm = document.getElementById('edit-doctor-form');
        const editDoctorId = document.getElementById('edit-doctor-id');
        const editDoctorName = document.getElementById('edit-doctor-name');
        const editDoctorQualification = document.getElementById('edit-doctor-qualification');
        const editDoctorRating = document.getElementById('edit-doctor-rating');
        const editDoctorDescription = document.getElementById('edit-doctor-description');
        const editDoctorImageInput = document.getElementById('edit-doctor-image-input');
        const editDoctorImagePreview = document.getElementById('edit-doctor-image-preview').querySelector('img');
        const editDoctorFileNameSpan = document.getElementById('edit-doctor-file-name');
        const backToListBtn = document.getElementById('back-to-list-btn');


        let currentImageCell = null;

        // Function to show the correct dashboard panel
        function setActivePanel(panelId) {
            panels.forEach(panel => {
                panel.classList.add('hidden');
            });
            document.getElementById(panelId).classList.remove('hidden');
        }

        // Add click listeners to sidebar links
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                setActivePanel(link.id.replace('-link', '-panel'));
                // Hide edit view when switching panels
                doctorsListView.classList.remove('hidden');
                editDoctorView.classList.add('hidden');
            });
        });

        // Banner Image Upload and Preview Logic
        const bannerImageInput = document.getElementById('banner-image-input');
        const bannerFileNameSpan = document.getElementById('banner-file-name');
        const bannerPreview = document.getElementById('banner-preview');

        bannerImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                bannerFileNameSpan.textContent = file.name;
                const reader = new FileReader();
                reader.onload = (event) => {
                    bannerPreview.style.backgroundImage = `url('${event.target.result}')`;
                };
                reader.readAsDataURL(file);
            } else {
                bannerFileNameSpan.textContent = 'No file chosen';
                bannerPreview.style.backgroundImage = 'none';
            }
        });

        // About Us Image Upload and Preview Logic
        const aboutUsImageInput = document.getElementById('about-us-image-input');
        const aboutUsFileNameSpan = document.getElementById('about-us-file-name');
        const aboutUsPreview = document.getElementById('about-us-preview');
        const aboutUsImg = document.getElementById('about-us-img');

        aboutUsImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                aboutUsFileNameSpan.textContent = file.name;
                const reader = new FileReader();
                reader.onload = (event) => {
                    aboutUsImg.src = event.target.result;
                    aboutUsImg.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            } else {
                aboutUsFileNameSpan.textContent = 'No file chosen';
                aboutUsImg.classList.add('hidden');
            }
        });

        // Best Doctors Table Edit/Delete/Image Upload Logic
        doctorsTableBody.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;

            if (target.classList.contains('edit-btn')) {
                const cells = row.querySelectorAll('td');
                const doctorData = {
                    id: cells[0].textContent,
                    image: cells[1].querySelector('img').src,
                    name: cells[2].textContent,
                    qualification: cells[3].textContent,
                    rating: cells[4].textContent,
                    description: cells[5].textContent
                };

                // Populate and show the edit form
                editDoctorId.value = doctorData.id;
                editDoctorName.value = doctorData.name;
                editDoctorQualification.value = doctorData.qualification;
                editDoctorRating.value = doctorData.rating;
                editDoctorDescription.value = doctorData.description;
                editDoctorImagePreview.src = doctorData.image;
                editDoctorFileNameSpan.textContent = 'No file chosen';

                doctorsListView.classList.add('hidden');
                editDoctorView.classList.remove('hidden');

            } else if (target.classList.contains('delete-btn')) {
                // Delete mode: remove the entire row
                row.remove();
            } else if (target.closest('.doctor-image-cell')) {
                // Image upload: trigger file input for the correct cell
                currentImageCell = target.closest('.doctor-image-cell').querySelector('img');
                doctorImageFileInput.click();
            }
        });

        doctorImageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && currentImageCell) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentImageCell.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Add New Doctor functionality
        addNewDoctorBtn.addEventListener('click', () => {
            const tableRows = doctorsTableBody.querySelectorAll('tr');
            const lastRowId = tableRows.length > 0 ? parseInt(tableRows[tableRows.length - 1].dataset.id) : 0;
            const newId = lastRowId + 1;

            const newRow = document.createElement('tr');
            newRow.setAttribute('data-id', newId);
            newRow.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${newId}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 doctor-image-cell">
                    <div class="w-16 h-16 bg-gray-200 overflow-hidden flex items-center justify-center">
                        <img src="https://placehold.co/80x80/E5E7EB/6B7280?text=Dr" alt="Doctor Image" class="w-full h-full object-cover">
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">New Doctor</td>
                <td class="px-6 py-4 whitespace-nowrap text-base text-gray-500">Qualification</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">★★★★★</td>
                <td class="px-6 py-4 text-base text-gray-500">Description</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-2 edit-btn" data-action="edit">Edit</button>
                    <button class="text-red-600 hover:text-red-900 delete-btn">Delete</button>
                </td>
            `;

            doctorsTableBody.appendChild(newRow);
        });
        
        // Add New Comment functionality
        addNewCommentBtn.addEventListener('click', () => {
            const tableRows = commentsTableBody.querySelectorAll('tr');
            const lastRowId = tableRows.length > 0 ? parseInt(tableRows[tableRows.length - 1].querySelector('td').textContent) : 0;
            const newId = lastRowId + 1;

            const newRow = document.createElement('tr');
            newRow.setAttribute('data-id', newId);
            newRow.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${newId}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 editable" contenteditable="true">New Comment Title</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 editable" contenteditable="true">New Comment Description</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-400 editable" contenteditable="true">★★★★★</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 editable" contenteditable="true">New Commenter Name</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-2 edit-btn" data-action="save">Save</button>
                    <button class="text-red-600 hover:text-red-900 delete-btn">Delete</button>
                </td>
            `;

            commentsTableBody.appendChild(newRow);
        });

        commentsTableBody.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;

            if (target.classList.contains('edit-btn')) {
                const isEditing = target.textContent === 'Save';
                const cells = row.querySelectorAll('td');

                if (isEditing) {
                    cells.forEach(cell => {
                        cell.removeAttribute('contenteditable');
                        cell.classList.remove('editable');
                    });
                    target.textContent = 'Edit';
                } else {
                    cells.forEach((cell, index) => {
                        if (index > 0 && index < cells.length - 1) {
                            cell.setAttribute('contenteditable', 'true');
                            cell.classList.add('editable');
                        }
                    });
                    target.textContent = 'Save';
                }
            } else if (target.classList.contains('delete-btn')) {
                row.remove();
            }
        });
        
        // New Doctor Edit View Logic
        editDoctorImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                editDoctorFileNameSpan.textContent = file.name;
                const reader = new FileReader();
                reader.onload = (event) => {
                    editDoctorImagePreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                editDoctorFileNameSpan.textContent = 'No file chosen';
            }
        });
        
        backToListBtn.addEventListener('click', () => {
            doctorsListView.classList.remove('hidden');
            editDoctorView.classList.add('hidden');
        });
        
        editDoctorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const doctorId = editDoctorId.value;
            const doctorRow = doctorsTableBody.querySelector(`tr[data-id="${doctorId}"]`);
            if (doctorRow) {
                const cells = doctorRow.querySelectorAll('td');
                cells[2].textContent = editDoctorName.value;
                cells[3].textContent = editDoctorQualification.value;
                cells[4].textContent = editDoctorRating.value;
                cells[5].textContent = editDoctorDescription.value;
                
                // Update image if a new one was selected
                if (editDoctorImageInput.files.length > 0) {
                    const newImage = editDoctorImagePreview.src;
                    cells[1].querySelector('img').src = newImage;
                }
                
                // Switch back to the list view
                doctorsListView.classList.remove('hidden');
                editDoctorView.classList.add('hidden');
            }
        });

    });

    function expandBorder(id) {
        const element = document.getElementById(id);
        element.style.width = '100%';
    }

    function shrinkBorder(id) {
        const element = document.getElementById(id);
        element.style.width = '80%';
    }

