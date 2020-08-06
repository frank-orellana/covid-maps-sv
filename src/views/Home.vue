<template>
  <div class="home">
    <Mapa/>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Mapa from '@/components/Mapa.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Home',
  components: {
    Mapa, Footer
  }
}
</script>

<style scoped>
.copy {
  font-size: x-small;
}
</style>