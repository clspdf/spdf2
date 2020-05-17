<template>
    <v-container fluid class="grey lighten-5">
        <Navbar :title="this.$options.name.toUpperCase()"></Navbar>      
        <v-container fluid class="grey lighten-5">
            <v-row justify="space-around">
                <v-form>
                    <v-text-field v-model="user.name" label="Name"></v-text-field>
                    <v-text-field v-model="user.password" label="Password"></v-text-field>
                    <v-btn color="success" @click="login">Login In</v-btn>
                    <v-btn router-link to='/Todos'>Todos</v-btn>
                </v-form>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
import UserService from '../components/UserService';
import mapGetters from 'vuex';
import Navbar from '../components/Navbar';

export default {
    name: 'Login',
    components: {
        Navbar,
    },
    data() {
        return {
            user: {
                name: 'spdf_hash',
                password: ''
            },
            

        }
    },
    methods:{
        async login() {
            // use login service to login!
            // console.log(this.user);
            
            const userID = await UserService.login(this.user);
            
            // console.log(userID.data);
            if (userID.data) {
                
                // console.log(userID);
                this.$store.commit('users/setUserID', userID.data);
                
                // console.log(this.$store.state.users.userID);
                console.log(`Now the state has been changed to - ${this.$store.getters['users/getUserID']}`);
            } else {
                console.log('nil valid ID');
            }
            
            this.user = {
                name: '',
                password: ''
            },
            
            this.$router.push('todos');
        },
    },
    

}
</script>

<style>

</style>