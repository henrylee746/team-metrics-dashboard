<img width="1719" height="548" alt="chartImage1" src="https://github.com/user-attachments/assets/63823c0b-96f7-439d-a4aa-2eeecd613f87" />

# :bar_chart: Team Metrics Dashboard

Welcome to the Team Metrics Dashboard project. This was a personal project originated from my internship at Ericsson Canada, tasked with designing a web application to scrape performance metrics of employees off of pushed code commits using the Gerrit REST API.

## Getting Started

<img width="1655" height="434" alt="image" src="https://github.com/user-attachments/assets/775cf203-71b5-4465-b63c-b6e7ccce40ca" />

Access the tool here: https://team-metrics-dashboard.vercel.app/
There are two pages at the header: *"Search"* (the main page) for queries and chart displays, but for first-time users, a *"How to Use"* page was also implemented.

## :arrow_right: Extension of the project

Currently, this project does not contain any real information anymore, and everything is scraped off a Supabase PostgreSQL mock dataset. 

The dataset is relatively small, containing only two mock "employees" and two "commit subjects" - each employee/subject containing a set of commits worked on with code churn numbers.

### :question: What is Code Churn?

Code Churn (a.k.a. Code Rework) is the phenomenon where someone rewrites/deletes lines of code shortly after it was wrote. This is common in the SDLC (Software Development Life Cycle) and is a good metric to measure a developer's productivity/blockers, depending on the context.

> Low churn could mean slow productivity but also a lack of needing to refactor due to clear requirements, high-quality code, and passing of unit tests on the first trial.
> 
> High code churn could mean high productivity if there is a large feature being worked on/function(s) constantly being optimized, but also an issue with testing/unclear user requirements if the same blocks of code are consistently being changed

### :yellow_square: Next Steps
<ul>
  <li>State is persistent even when switching betwen pages (global state/redux/zustand)</li>
  <li>Implementing React.useEffect cleanup functions</li>
</ul>

