<template>
    <v-container fluid class="grey lighten-5">
        <Navbar :title="this.$options.name.toUpperCase()"></Navbar>
        


        <v-dialog max-width="500px" v-model="new_dialog">
            <template v-slot:activator="{ on }">
                <v-btn color="primary white--text" v-on="on" class="my-3 ml-5" >
                    Add New
                </v-btn>                
                                 
            </template>
            <v-card>
                <v-card-title>{{formTitle}}</v-card-title>
                <v-card-text>
                    <v-text-field v-model="editedTodo.title" label="Title"></v-text-field>
                    <v-textarea auto-grow v-model="editedTodo.content" label="Content"></v-textarea>
                    <v-text-field v-model="editedTodo.status" label="Status"></v-text-field>
                    <v-text-field v-model="editedTodo.due" label="Due By"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="close">Cancel</v-btn>
                    <v-btn color="success" @click="save" :loading="loading">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <v-card class="mx-5" v-for="todo in todos" :key="todo._id">
            <v-row no-gutters>
                <v-col cols="12" md="6">
                    <div>
                        <v-card flat class="pl-3 font-weight-bold headline d-flex align-end justify-right" height="30">
                            {{todo.title}}
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="pl-3 pa-1 font-weight-regular">
                            {{todo.content}}
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="4" md="2">
                    <div>
                        <v-card flat class="pl-3 font-weight-bold grey--text d-flex align-end justify-right" height="30">
                            Due By
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="pl-3 pa-1 font-weight-regular">
                            {{todo.due}}
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="4" md="2">
                    <div>
                        <v-card flat class="pl-3 font-weight-bold grey--text d-flex align-end justify-right" height="30">
                            Created On
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="pl-3 pa-1 font-weight-regular">
                            {{todo.created}}
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="4" md="2">
                    <div>
                        <v-card flat class="d-flex justify-end align-end pr-3" height="30">
                            <v-chip color="primary" small>{{todo.status}}</v-chip>
                            
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="d-flex justify-end align-end pr-3" height="30">
                            <v-btn icon color="primary" @click="editTodo(todo)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            
                            
                            <v-btn icon color="warning" @click="deleteTodo(todo)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-card>
                    </div>
                    
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import Navbar from '../components/Navbar';
import TodoService from '../components/TodoService';

export default {
    name: 'Todos',
    components: {
        Navbar
    },
    data() {
        return {
            todos:[],
            loading: false,
            editedIndex: -1,
            new_dialog: false,
            editedTodo: {
                title: '',
                content: '',
                status: '',
                due: '',
            },
            blankTodo: {
                title: '',
                content: '',
                status: '',
                due: '',
            },
        }
    },
    methods:{
        async getAllTodos() {
            this.todos = (await TodoService.getTodos()).data;
        },
        close() {
            this.new_dialog = false;
            this.$nextTick(() => {
                this.editedTodo = Object.assign({}, this.blankTodo);
                this.editedIndex = -1;
            });
        },
        async save() {
            this.loading = true;
            if (this.editedIndex === -1) {
                this.editedTodo.created = new Date().toLocaleString('en-CN', {weekday:'short', year: 'numeric', month: 'short', day: 'numeric'});
                try {
                    await TodoService.createTodo(this.editedTodo);
                    await this.getAllTodos();
                    this.loading = false;
                    this.close();
                } catch (error) {
                    console.log(error);
                }
            } else {
                this.editedTodo.created = new Date().toLocaleString('en-CN', {weekday:'short', year: 'numeric', month: 'short', day: 'numeric'});
                try {
                    // console.log(this.editedTodo);
                    const msg = await TodoService.updateTodo(this.editedTodo, this.editedIndex);
                    // console.log(`msg from api: ${msg}`);
                    await this.getAllTodos();
                    this.loading = false;
                    this.close();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        editTodo(todo) {
            this.editedIndex = todo._id;
            this.editedTodo = Object.assign({}, todo);
            // console.log(this.editedTodo);
            // console.log(this.editedIndex);
            this.new_dialog = true;
        },
        async deleteTodo(todo) {
            await TodoService.deleteTodo(todo._id);
            await this.getAllTodos();
        }
    },
    async created() {
        this.todos = (await TodoService.getTodos()).data;
        // console.log(this.todos);
    },
    computed: {
        formTitle(){
            return this.editedIndex === -1 ? 'New TODO' : 'Edit TODO';
        }
    },
    // watch: {
    //     dialog(val) {
    //         val || this.close();
    //     }
    // }
}
</script>

<style>

</style>