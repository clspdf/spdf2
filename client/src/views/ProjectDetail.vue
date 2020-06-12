<template>
    <v-container fluid class="grey lighten-5">
        <Navbar :title="'Project Details'.toUpperCase()"></Navbar>
        <h1>Projec ID: {{projectID}}  Project Title: {{projectTitle}}</h1>

        <!-- This is the Project Details -->

        <v-card class="mx-5">
            <v-row no-gutters>
                <v-col cols="12" md="6">
                    <div>
                        <v-card flat class="pl-3 font-weight-bold headline d-flex align-end justify-right" height="30">
                            {{project.title}}
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="pl-3 pa-1 font-weight-regular">
                            {{project.content}}
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
                            {{project.due}}
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
                            {{project.created}}
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="4" md="2">
                    <div>
                        <v-card flat class="d-flex justify-end align-end pr-3" height="30">
                            <v-chip color="primary" small>{{project.status}}</v-chip>
                            
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="d-flex justify-end align-end pr-3" height="30">
                            <v-btn icon color="primary" @click="editProject(project)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            
                            
                            <v-btn icon color="warning" @click="deleteProject(project)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-card>
                    </div>
                    
                </v-col>
            </v-row>
        
        
        </v-card>
        
        <!-- this is the pop up to accommodate new/edit todos/projects;  -->
        

        <v-dialog max-width="500px" v-model="dialog">
            <template v-slot:activator="{ on }">
                <v-btn color="primary white--text" v-on="on" class="my-3 ml-5" >
                    Add New
                </v-btn>                
                                 
            </template>
            <v-card>
                <v-card-title>{{formTitle}}</v-card-title>
                <v-card-text>
                    <v-text-field readonly :placeholder="projectTitle"></v-text-field>
                    <v-text-field v-model="editedTodo.title" label="Title"></v-text-field>
                    
                    <v-textarea auto-grow v-model="editedTodo.content" label="Content"></v-textarea>
                    <v-text-field v-model="editedTodo.status" label="Status"></v-text-field>
                    <!-- <v-text-field v-model="editedTodo.due" label="Due By"></v-text-field> -->
                    <v-menu v-model="due_menu" :close-on-content-click="false" transition="scale-transition" min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="editedTodo.due" label="Pick a due date" prepend-inner-icon="mdi-calendar" readonly v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="editedTodo.due" no-title scrollable @input="due_menu = false">
                        </v-date-picker>
                    </v-menu>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="close">Cancel</v-btn>
                    <v-btn color="success" @click="save" :loading="loading">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <h1>This is the current Todo List</h1>
        <strong>Previous Index: {{oldIndex}}</strong>
        <strong>New Index: {{newIndex}}</strong>
        <v-overlay :value="overlay">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <draggable v-model="projectTodos" group="todos" @end="onEnd" ghost-class="ghost"> 
            <transition-group>
                <v-card class="mx-5 my-2" v-for="projectTodo in projectTodos" :key="projectTodo._id">
                    <v-row no-gutters>
                        <v-col cols="12" md="6">
                            <div>
                                <v-card flat class="pl-3 font-weight-bold headline d-flex align-end justify-right" height="30">
                                    {{projectTodo.title}}
                                </v-card>
                            </div>
                            <div>
                                <v-card flat class="pl-3 pa-1 font-weight-regular">
                                    {{projectTodo.content}}
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
                                    {{projectTodo.due}}
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
                                    {{projectTodo.created}}
                                </v-card>
                            </div>
                        </v-col>
                        <v-col cols="4" md="2">
                            <div>
                                <v-card flat class="d-flex justify-end align-end pr-3" height="30">
                                    <v-chip color="primary" small>{{projectTodo.status}}</v-chip>
                                    
                                </v-card>
                            </div>
                            <div>
                                <v-card flat class="d-flex justify-end align-end pr-3" height="30">
                                    <v-btn icon color="primary" @click="editProjectTodo(projectTodo)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    
                                    
                                    <v-btn icon color="warning" @click="deleteTodo(projectTodo)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </v-card>
                            </div>
                            
                        </v-col>
                    </v-row>
                </v-card>
            </transition-group>
            
        </draggable>
    </v-container>
</template>

<script>
import Navbar from '../components/Navbar';
import ProjectService from '../components/ProjectService';

import draggable from 'vuedraggable';

export default {
    name: 'ProjectDetail',
    components: {
        Navbar,
        draggable
    },
    data() {
        return {
            projectID: 'default',
            projectTitle: '',
            project: '',
            projectTodos: [],
            date_menu: false,
            due_menu: false,
            orderTodo1: '',
            orderTodo2: '',
            overlay: false,
            dialog: false,
            editedIndex: -1,  // -1 for new projectTodo, 0 for edit projectTodo, and 1 for edit project
            editedTodo: {
                project_id: '',
                title: '',
                content: '',

                due: '',
                status: '',
                
            },
            blankTodo: {
                project_id: '',
                title: '',
                content: '',

                due: '',
                status: '',            
            },
            loading: false,
            oldIndex: '',
            newIndex: '',
        }
    },
    async created() {
        this.projectID = this.$route.params.projectid;
        this.projectTitle = this.$route.params.projecttitle;
        this.project = (await ProjectService.getOneProject(this.projectID)).data[0];
        this.projectTodos = (await ProjectService.getProjectTodos(this.projectID)).data;
        console.log(this.projectTodos);
    },
    methods: {
        async onEnd(evt) {
            this.oldIndex = evt.oldIndex;
            this.newIndex = evt.newIndex;
            console.log(`item ${this.oldIndex} moved to item ${this.newIndex}`);
            if (this.oldIndex === this.newIndex) {
                console.log('No order changed!')
            } else {
                this.overlay = true;
                console.log(`order changed, now trying to udpate db`);
                // console.log(this.projectTodos[evt.newIndex]._id);
                await ProjectService.reorderProjectTodos(this.projectID, this.oldIndex, this.newIndex, this.projectTodos[this.newIndex]._id);
                this.projectTodos = (await ProjectService.getProjectTodos(this.projectID)).data;
                console.log('re-order done!');
                this.oldIndex = '';
                this.newIndex = '';
                this.overlay = false;
            }

        },
        async deleteTodo(projectTodo) {
            // console.log(projectTodo);
            await ProjectService.deleteProjectTodo(projectTodo);
            this.projectTodos = (await ProjectService.getProjectTodos(this.projectID)).data;
        },
        async save() {
            this.loading = true;
            if (this.editedIndex === -1){ // new projectTodo
                this.editedTodo.project_id = this.projectID;
                console.log(this.editedTodo)
                await ProjectService.createProjectTodo(this.editedTodo);
                console.log('new projectTodo created!')
                this.projectTodos = (await ProjectService.getProjectTodos(this.projectID)).data;
                this.loading = false;
                this.close();
            } else if (this.editedIndex === 0) {
                await ProjectService.updateProjectTodo(this.editedTodo);
                console.log('projectTodo updated!');
                this.projectTodos = (await ProjectService.getProjectTodos(this.projectID)).data;
                this.loading = false;
                this.close();
            } else { // 1 edit project
                // console.log('this route is to update project!');
                await ProjectService.updateProject(this.editedTodo);
                console.log('Project updated!');
                this.project = (await ProjectService.getOneProject(this.projectID)).data[0];
                this.projectTitle = this.project.title;
                this.close();
            }
        },
        close() {
            this.dialog = false;
            this.loading = false;
            this.$nextTick(() => {
                this.editedTodo = Object.assign({}, this.blankTodo);
                this.editedIndex = -1;
            })
        },
        editProjectTodo(projectTodo) {
            this.editedIndex = 0;
            this.editedTodo = Object.assign({}, projectTodo);
            this.dialog = true;
        },
        editProject(project) {
            this.editedIndex = 1;
            this.editedTodo = Object.assign({}, project);
            this.dialog = true;
        },
        async deleteProject(project) {
            await ProjectService.deleteProject(project);
            this.$router.push('/projects');
        }
    },
    computed: {
        formTitle(){
            if (this.editedIndex === -1) {
                return "new Project TODO";
            } else if (this.editedIndex === 0) {
                return "edit Project TODO";
            } else {
                return "edit Project";
            }
        }
    }
}
</script>

<style>

</style>