import { css } from 'lit';

export default css`
*, *::before,*::after {
    box-sizing: border-box;
    }

    * {
    margin: 0;
    padding: 0;

    }

:root {
  color-scheme: normal light dark;
}

#app-container {
  width: 100%;
  height: 100%;
  display: grid;

  grid-template-columns: 200px 1fr;
  grid-template-rows: 100px 1fr 50px;
  grid-template-areas:
    "header header"
    "sidebar main-content"
    "footer footer";
}

.header {
  grid-area: header;
  /* background-color: #f4f4f4; */
  padding: 20px;
}

.sidebar {
  grid-area: sidebar;
  /* background-color: #333; */
  padding: 20px;
}

.main-content {
  grid-area: main-content;
  /* background-color: #fff; */
  padding: 20px;
  overflow-y: scroll;
}

.footer {
  grid-area: footer;
  /* background-color: #f4f4f4; */
  padding: 20px;
}

.snippet-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1em;
  width: 100%;
  height: 100%;

}

.snippet-item {
  flex: 1;
  width: 80%;
}
.snippet-item::part(body) {
  min-height: 13em;
}
`;