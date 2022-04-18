
<template>

    <div id="app">
        <router-view/>
    </div>
</template>

<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/mint-ui/lib/index.js"></script>
<script>
export default {
    name: 'App',
}
</script>
<link rel="stylesheet" href="https://unpkg.com/mint-ui/lib/style.css">

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>