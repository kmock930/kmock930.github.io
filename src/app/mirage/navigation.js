import { createServer } from "miragejs";

createServer({
  routes() {
    //this.namespace = "api";

    this.get("/topbar", () => {
      return [
            {
                "Home": [
                    "Welcoming", 
                    "About Me", 
                    {"My Professional Self": ["Resume", "Projects", "Education", "Work Experience"]}
                ]
            },
            {
                "Albums": [
                    "Childhood", 
                    {"Travel": ["Beijing", "London"]}
                ]
            },
            "Contact Me"
        ]}
    );
  }
});