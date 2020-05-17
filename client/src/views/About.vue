<template>
  <div class="Secret">
    <h1>This is a secret page!</h1>
    <Navbar :title="this.$options.name.toUpperCase()"></Navbar>
    <v-btn router-link to='/login'>go to login</v-btn>
  </div>
</template>

<script>
import Navbar from '../components/Navbar';

export default {
  name: 'Secret',
  components: {
    Navbar,
  }
}
</script>