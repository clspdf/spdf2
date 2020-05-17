<template>
    <v-app-bar dense flat color="primary" >
        <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
        <v-toolbar-title class="white--text">{{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="success" class="mr-2">Tool</v-btn>
        <v-btn color="white" @click="logout" icon v-if="isLogin">
            <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import UserService from '../components/UserService';

export default {
    name: 'Navbar',
    // data() {
    //     return {
    //         title:'default'
    //     }
    // },
    props:[
        'title',
        'canLogout'
    ],
    methods: {
        async logout() {
            // console.log('attempting to log out...');
            const res = await UserService.logout();
            if (res.data) {
                console.log('server session destroyed');
                this.$store.commit('users/setUserID', null);
                console.log('vuex reset to null');
                this.$router.push('/').catch((err) => {
                    console.log(`Error found as ${err}`);
                });
            } else {
                console.log('something is wrong');
            }
        }
    },
    computed:{
        isLogin() {
            return this.$store.getters['users/getUserID'] ? true : false;
        }
    }
}
</script>

<style>

</style>