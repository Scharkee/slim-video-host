<template>
  <div class="hiddenOverflow" @keyup.enter="activateLogin(true)">
    <div :style="background" ref="introBCG"></div>
    <!-- both the "welcome back" and "login" buttons -->
    <transition name="fadeUp" :duration="{ enter: 1000, leave: 20 }" appear>
      <a class="introMainButton" @click="activateLogin(true)" v-show="!showLogin">
        <p v-if="!$store.state.authUser" class="indexTitle">Login</p>
        <p v-else class="indexTitle minif">Welcome back</p>
      </a>
    </transition>
    <!-- login form/redirection notice -->
    <div v-show="showLogin" class="introLoginForm">
      <div class="centerHor" v-if="!$store.state.authUser">
        <el-form v-on:submit.prevent="login" class="formField" size="small" autocomplete="on">
          <p class="error" v-if="formError">{{ formError }}</p>
          <el-form-item prop="username">
            <input
              class="substituteInput topField"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              placeholder="Username"
              autocomplete="username"
              type="text"
              v-model="form.username"
              name="username"
            />
          </el-form-item>
          <el-form-item prop="password">
            <input
              class="substituteInput bottomField"
              @keydown.enter="login"
              placeholder="Password"
              type="password"
              v-model="form.password"
              autocomplete="current-password"
              name="password"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="loginButton" type="submit" @click="login">Login</el-button>
            <a
              type="text"
              @click="$store.app.router.push('/reset')"
              class="forgotPasswordLink"
            >Forgot your password?</a>
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="postLogin">
        Welcome back, {{ $store.state.authUser.username }}!
        <p>
          <i>Redirecting you to your dashboard.</i>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      intro: {
        backgroundImage: ""
      },
      form: {
        username: "",
        password: ""
      },
      formError: null,
      showLogin: false,
      gifTags: ["psychedelic", "trippy", "abstract", "3d"]
    };
  },
  computed: {
    // used to make both blur and the gif dynamic
    background() {
      return {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundImage: this.intro.backgroundImage,
        backgroundSize: "cover",
        "-webkit-background-size": "cover",
        "-moz-background-size": "cover",
        "-o-background-size": "cover",
        "background-size": "cover",
        "z-index": -1,
        filter: this.showLogin ? "blur(10px)" : "",
        transform: "scale(1.05)"
      };
    }
  },
  methods: {
    activateLogin(bool) {
      if (!this.$store.state.authUser) {
        this.showLogin = bool;
      } else {
        //user pressed "welcome back". Redirect to dashboard
        this.$nuxt._router.push("/dash");
        this.$store.dispatch("setActiveTab", "2");
      }
    },
    handleListener(event) {
      if (event.keyCode == 13) {
        this.activateLogin(true);
      }
      // registration hotkey
      if (event.altKey && event.keyCode == 82) {
        this.redirectToRegister();
      }
    },
    redirectToRegister() {
      this.$nuxt._router.push("/regg");
      this.$store.dispatch("setActiveTab", "2");
    },
    async login() {
      try {
        await this.$store.dispatch("login", {
          username: this.form.username,
          password: this.form.password
        });
        this.form.username = "";
        this.form.password = "";
        this.formError = null;
        this.$nuxt._router.push("/dash");
        this.$store.dispatch("setActiveTab", "2");
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    async logout() {
      try {
        await this.$store.dispatch("logout");
      } catch (e) {
        this.$message({
          type: "error",
          message: e.msg
        });
      }
    }
  },
  created() {
    /// choosing a random tag and retrieving a gif
    let randomTag = this.gifTags[
      Math.floor(Math.random() * this.gifTags.length)
    ];
    axios
      .get(
        "https://api.giphy.com/v1/gifs/random?api_key=jx9U8gsKgM80au8DRAUhYlaWYqibA4AO&tag=" +
          randomTag
      )
      .then(res => {
        this.intro.backgroundImage =
          "url(" + res.data.data.image_original_url + ")";
      })
      .catch(e => {});
    // listener for various key combos
    if (process.browser) {
      window.addEventListener("keyup", event => {
        this.handleListener(event);
      });
    }
  },
  destroyed() {
    if (process.browser) {
      window.removeEventListener("keyup", event => {
        this.handleListener(event);
      });
    }
  },
  head: {
    title: "Welcome"
  }
};
</script>

<style scoped>
.el-button {
  border: none !important;
  background: rgba(0, 0, 0, 0.801) !important;
  color: #ffffff !important;
  -webkit-transition: 0.1s;
  transition: 0.2s !important;
  transition-property: color, background-color;
  width: 21vw;
  height: 8vh;
  margin-bottom: 2vh;
}

@font-face {
  font-family: "LatoLight";
  src: url("/fonts/LatoLight/Lato-Light.eot"),
    url("/fonts/LatoLight/Lato-Light.woff") format("woff"),
    url("/fonts/LatoLight/Lato-Light.ttf") format("truetype");
  font-style: normal;
  font-weight: normal;
}

.indexTitle {
  font-family: LatoLight;
  font-size: 15vmin;
  transform: translate(0, -5vmin);
}

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 3px;
}

::selection {
  background: #dddddd; /* WebKit/Blink Browsers */
}

.el-button:hover,
.el-button:focus,
.el-button:active {
  background: rgba(255, 255, 255, 0.801) !important;
  color: black !important;
}

@keyframes fadeUp {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }
}

.fadeUp-enter-active {
  animation: fadeUp 1s;
}
</style>


<style>
.postLogin {
  margin-top: 10vh;
  text-align: center;
  font-size: 1.5vh;
}

::-webkit-scrollbar {
  display: none;
}

.bottomField {
  margin-bottom: 3.5vh !important;
}

.forgotPasswordLink {
  position: absolute;
  margin-top: -2vh !important;
  cursor: pointer;
  margin: auto;
  font-family: LatoRegular;
  font-size: 2vmin;
}

.forgotPasswordLink:hover {
  color: black;
  font-weight: bold;
  font-size: 150%;
  border-bottom: solid 2 px white;
}

.substituteInput {
  font-family: LatoRegular !important;
  background: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  padding: 0 4px !important;
  font-size: 4vh !important;
  height: 7vmin !important;
  width: 20vmax !important;
  border: solid 5px white !important;
  clip-path: polygon(
    calc(0%) calc(0% + 5px),
    calc(100% - 5px) calc(0% + 5px),
    calc(100% - 5px) calc(100% - 5px),
    calc(0%) calc(100% - 5px)
  );
  transition: clip-path 0.2s ease;
}

.substituteInput:focus {
  outline: none;
  clip-path: polygon(
    calc(0%+5px) calc(0%+5px),
    calc(100%-5px) calc(0%+5px),
    calc(100%-5px) calc(100%),
    calc(0%+5px) 100%
  );
}

@font-face {
  font-family: "LatoRegular";
  src: url("/fonts/LatoRegular/Lato-Regular.eot"),
    url("/fonts/LatoRegular/Lato-Regular.woff") format("woff"),
    url("/fonts/LatoRegular/Lato-Regular.ttf") format("truetype");
  font-style: normal;
  font-weight: normal;
}

a {
  text-decoration: none;
  transition: 0.6s;
}

a:hover {
  color: black;
}

.topField {
  margin-top: 3vh;
}

.welcomeText {
  color: white;
  text-align: center;
  vertical-align: middle;
  position: relative;
  width: 100%;
  height: 100%;
}

.centerHor {
  justify-content: center;
}

.introMainButton {
  background: black;
  text-align: center;
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.7;
  height: 35vh;
  width: 40vw;
  content: center;
  font-size: 14vh;
  color: white;
  border: solid 0.5vw white;
  font-family: LatoRegular;
  cursor: pointer;
  text-align: center;
}

.introMainButton:hover,
.introMainButton:focus,
.introMainButton:active {
  background: rgba(255, 255, 255, 0.801) !important;
  color: black !important;
}

.introLoginForm {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 35vh;
  width: 40vw;
  color: white;
}

.minif {
  font-size: 10vmin !important;
  transform: translate(0, 3vmin) !important;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.inputField {
  max-width: 100%;
}

.formField {
  max-width: 50%;
  margin: 0 auto;
}

.loginButton {
  margin: 0 auto;
  font-size: 3vh !important;
  width: 21vmax !important;
}
</style>





