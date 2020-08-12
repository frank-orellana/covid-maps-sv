<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Mapa</router-link> |
      <router-link to="/graficos">Gráficos</router-link><!-- |
      <router-link to="/about">About</router-link-->
    </div>
    <router-view/>
  </div>
</template>

<style>
body {
  background-color: lightslategray;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 5px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%)
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
