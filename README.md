
Easywork: CV Engine
============================================================

<b>General idea of the application</b>
<ul>
  <li>Provide Companies to enter jobs and look for potentia lemployees.</li>
  <li>Provide Users the ability to look for jobs and contact companies.</li>
</ul>

<b>Technologies:</b> AngularJS, NodeJS, Express and MongoDB

<b>Key Features</b>
<ul>
<li>The ability to scan CV (Doc format) and give a company the ability to search for users that have interesting keywords in their CV (Java , Technion...) - Implemented but not supported by the UI yet.</li>
<li>Intuitive UI</li>
</ul>


<b>User Flows:</b>
Company
Manage Company Content
1. login (user:wix, pass:w)
2. wix --> My Jobs --> create, remove and update a job
User
Search for a job
1. login (user:user, pass:u)
2. In Technologies enter "Haifa" --> Search
3. Change search preferences as you like
4. Click "More Details" for a job
Manage my profile
1. login (user:user, pass:u)
2. chen --> My User Profile --> Update details (Uploading CV not working well in Heroku)
Admin 
login (user:admin, pass:a)
All the above + permissions to access all content
