<template>
    <v-container fluid class="grey lighten-5">
        <Navbar :title="this.$options.name.toUpperCase()"></Navbar>
        <v-overlay :value="overlay"></v-overlay>      
        <!-- For Setting Week View -->
        <!-- <h1>date format from date picker{{(this.selectedWeekDate)}}</h1>
        <h1>this is the parsed string{{this.formattedWeekDate}}</h1>
        <h1>Here is to set a date picker for week</h1>
        <h1>start of the week: {{startOfWeek}}</h1>
        <h1>end of the week: {{endOfWeek}}</h1> -->
        <v-menu v-model="dayMenu" :close-on-content-click="false" transition="scale-transition" min-width="290px">
            <template v-slot:activator="{ on }">
                <v-text-field :value="formattedWeekDate" label="Pick a Week by Date" prepend-inner-icon="mdi-calendar" readonly v-on="on" class="ma-3">
                </v-text-field>
            </template>
            <v-date-picker v-model="selectedWeekDate" no-title scrollable @change="selectedDateChange" first-day-of-week="1">
            </v-date-picker>
        </v-menu>
        
        <v-switch v-model="weekSwitch" label="Show Week?"></v-switch>
        <!-- <h1>{{currentWeekSchedule}}</h1> -->
        
        <v-card v-if="weekSwitch">
            <!-- Week: Create and Edit -->
            <v-card-title>
                Week
            </v-card-title>
            <v-card-actions v-if="!weekEditing">
                <v-btn color="primary" v-if="weekExist" @click="editWeek">edit</v-btn>
                <v-btn color="primary" v-else @click="createWeek">create</v-btn>
                
            </v-card-actions>
            
            <v-card-actions>
                <v-btn color="secondary" v-if="weekEditing" @click="close">Cancel</v-btn>
                <v-btn color="success" v-if="weekEditing" @click="save">OK</v-btn>
            </v-card-actions>
            

            <v-card flat>
                <v-card-title>
                    For Work
                </v-card-title>

                <!-- display workArray -->
                <v-row v-for="(project, index) in workArray" :key="index" no-gutters>
                    <v-col cols="8" md="6">
                        <v-card-text class="subtitle-1">W{{index + 1}} {{project.title}}</v-card-text>
                    </v-col>
                    <v-col cols="1" md="2" >
                        <v-btn color="warning" icon class="pa-8" v-if="weekEditing" :disabled="!weekEditing">
                            <v-icon medium @click="delWork(index)">mdi-minus-circle-outline</v-icon>
                        </v-btn> 
                    </v-col>
                    
                                       
                </v-row>
                
                <!-- edit workArray -->
                <v-card flat>
                    <v-row no-gutters>
                        <v-col cols="8" md="6">
                            <v-overflow-btn :items="projectSerial" v-model="selectedProjectSerialWork" v-if="weekEditing" class="ml-3"></v-overflow-btn>
                        </v-col>
                        <v-col cols="1" md="2" align-start>
                            <v-icon color="primary" medium class="pa-6" @click="addWork" v-if="weekEditing">mdi-plus-circle-outline</v-icon>
                        </v-col>
                    </v-row>
                </v-card>
                
                
                
                
            </v-card>
            <v-card flat>
                <v-card-title>
                    For Growth
                </v-card-title>

                <v-row v-for="(project, index) in growthArray" :key="index" no-gutters>
                    <v-col cols="8" md="6">
                        <v-card-text class="subtitle-1">G{{index + 1}} {{project.title}}</v-card-text>
                    </v-col>
                    <v-col cols="1" md="2">
                        <v-btn color="warning" icon class="pa-8" v-if="weekEditing" :disabled="!weekEditing">
                            <v-icon medium @click="delGrowth(index)">mdi-minus-circle-outline</v-icon>
                        </v-btn> 
                    </v-col>
                    
                                       
                </v-row>
                
                
                <v-row no-gutters>
                    <v-col cols="8" md="6">
                        <v-overflow-btn :items="projectSerial" v-model="selectedProjectSerialGrowth" v-if="weekEditing" class="ml-3"></v-overflow-btn>
                    </v-col>
                    <v-col cols="1" md="2" align-center>
                        <v-icon color="primary" medium class="pa-6" @click="addGrowth" v-if="weekEditing">mdi-plus-circle-outline</v-icon>
                    </v-col>
                </v-row>

                
            </v-card>


            <v-card flat>
                <v-card-title>
                    For Life
                </v-card-title>
                <v-row v-for="(project, index) in lifeArray" :key="index" no-gutters>
                    <v-col cols="8" md="6">
                        <v-card-text class="subtitle-1">L{{index + 1}} {{project.title}}</v-card-text>
                    </v-col>
                    <v-col cols="1" md="2">
                        <v-btn color="warning" icon class="pa-8" v-if="weekEditing" :disabled="!weekEditing">
                            <v-icon medium @click="delLife(index)">mdi-minus-circle-outline</v-icon>
                        </v-btn> 
                    </v-col>
                    
                                       
                </v-row>
                
                
                <v-row no-gutters>
                    <v-col cols="8" md="6">
                        <v-overflow-btn :items="projectSerial" v-model="selectedProjectSerialLife" v-if="weekEditing" class="ml-3"></v-overflow-btn>
                    </v-col>
                    <v-col cols="1" md="2" align-center>
                        <v-icon color="primary" medium class="pa-6" @click="addLife" v-if="weekEditing">mdi-plus-circle-outline</v-icon>
                    </v-col>
                </v-row>
            </v-card>
            <v-card-title>Weekly Comment</v-card-title>
            <v-textarea v-model="weekComment" row-height="12" auto-grow outlined clearable placeholder="enter weekly comment" :readonly="!weekEditing" class="mx-3"></v-textarea>

        </v-card>

        <!-- for Daily View -->
        <!-- <h1>Here is for Day</h1> -->
        
        <v-menu v-model="weekdayMenu" offset-x :close-on-content-click="false" nudge-width="50" v-if="weekExist">
            <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" class="my-3">
                    Show Weekday
                </v-btn>
            </template>
            <v-card>
                <v-list v-for="(weekDate, index) in formattedWeekDates" :key="index">
                    <v-list-item>
                        <v-list-item-action>
                            <v-checkbox v-model="datesToShow" :label="weekDate" :value="weekDate"></v-checkbox>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card>

        </v-menu>
        <!-- <h1 v-for="(date, index) in weekDates" :key="index">{{date.text}}</h1> -->

        <v-card v-for="(date, index) in datesToShowSorted" :key="`${date}_${index}`">
            <v-card>
                <v-card-title>{{date}}</v-card-title>

                <v-card-actions>
                    <v-btn color="primary" @click="editDaily(date)" v-if="!editingDay">edit</v-btn>
                    <v-btn color="secondary" v-if="date === editingDate" @click="close">cancel</v-btn>
                    <v-btn color="success" v-if="date === editingDate" @click="save">ok</v-btn>
                </v-card-actions>

                <!-- for display -->

                <v-card-title>Work</v-card-title>

                <template v-for="(todos, workTag, index2) in dailySchedule[date].dailyWorkArray">

                
                    <v-card flat :key="`${date}_${workTag}_${index2}`">
                        <template v-for="(todo, index3) in todos">
                            <v-row no-gutters :key="`${date}_${todo.title}_${workTag}_${index3}`" align="center">
                                <v-col cols="8" md="6" >
                                    <v-card-text class="subtitle-1">{{workTag}} {{todo.title}}</v-card-text>
                                </v-col>
                                <v-col cols="1" md="2" >
                                    <v-btn color="warning" icon class="pa-8" v-if="date === editingDate">
                                        <v-icon medium @click="delDailyWork(date, workTag, index3)">mdi-minus-circle-outline</v-icon>
                                    </v-btn> 
                                </v-col>
                                
                            </v-row>
                        </template>
                    </v-card>
                </template>

                <!-- for editing -->

                <v-row no-gutters v-if="(date === editingDate) && (editingDay)" >
                    <v-col cols="2" md="1">
                        <v-overflow-btn :items="weekWorkTag" v-model="selectedWorkTag" v-if="editingDay" @change="fetchWorkProjectTodos" class="ml-3"></v-overflow-btn>
                    </v-col>
                    <v-col cols="7" md="5">
                        <v-overflow-btn :items="dailyWorkTodoArray" v-model="selectedWorkTodo" v-if="editingDay" @change="triggerNewWorkTodo"></v-overflow-btn>
                    </v-col>
                    <v-col cols="1" md="2" align-center>
                        <v-icon color="success" medium class="pa-6" @click="addDailyWork(date)">mdi-plus-circle-outline</v-icon>
                    </v-col>
                </v-row>

                <v-card-title>Growth</v-card-title>

                <template v-for="(todos, growthTag, index2) in dailySchedule[date].dailyGrowthArray">
                    <v-card flat :key="`${date}_${growthTag}_${index2}`">
                        <template v-for="(todo, index3) in todos">
                            <v-row no-gutters :key="`${date}_${todo.title}_${growthTag}_${index3}`" align="center">
                                <v-col cols="8" md="6" >
                                    <v-card-text class="subtitle-1">{{growthTag}} {{todo.title}}</v-card-text>
                                </v-col>
                                <v-col cols="1" md="2" >
                                    <v-btn color="warning" icon class="pa-8" v-if="date === editingDate">
                                        <v-icon medium @click="delDailyGrowth(date, growthTag, index3)">mdi-minus-circle-outline</v-icon>
                                    </v-btn> 
                                </v-col>
                                
                            </v-row>
                        </template>
                        

                        
                                        
                    </v-card>
                </template>


                <!-- for editing -->

                <v-row no-gutters v-if="(date === editingDate) && (editingDay)" >
                    <v-col cols="2" md="1">
                        <v-overflow-btn :items="weekGrowthTag" v-model="selectedGrowthTag" v-if="editingDay" @change="fetchGrowthProjectTodos" class="ml-3"></v-overflow-btn>
                    </v-col>
                    <v-col cols="7" md="5">
                        <v-overflow-btn :items="dailyGrowthTodoArray" v-model="selectedGrowthTodo" v-if="editingDay" @change="triggerNewGrowthTodo"></v-overflow-btn>
                    </v-col>
                    <v-col cols="1" md="2" align-center>
                        <v-icon color="success" medium class="pa-6" @click="addDailyGrowth(date)">mdi-plus-circle-outline</v-icon>
                    </v-col>
                </v-row>

                <v-card-title>Life</v-card-title>

                <template v-for="(todos, lifeTag, index2) in dailySchedule[date].dailyLifeArray">
                    <v-card flat :key="`${date}_${lifeTag}_${index2}`">
                        <template v-for="(todo, index3) in todos">
                            <v-row no-gutters :key="`${date}_${todo.title}_${lifeTag}_${index3}`" align="center">
                                <v-col cols="8" md="6" >
                                    <v-card-text class="subtitle-1">{{lifeTag}} {{todo.title}}</v-card-text>
                                </v-col>
                                <v-col cols="1" md="2" >
                                    <v-btn color="warning" icon class="pa-8" v-if="date === editingDate">
                                        <v-icon medium @click="delDailyLife(date, lifeTag, index3)">mdi-minus-circle-outline</v-icon>
                                    </v-btn> 
                                </v-col>
                                
                            </v-row>
                        </template>
                    </v-card>
                </template>
                

                <!-- for editing -->

                <v-row no-gutters v-if="(date === editingDate) && (editingDay)" >
                    <v-col cols="2" md="1">
                        <v-overflow-btn :items="weekLifeTag" v-model="selectedLifeTag" v-if="editingDay" @change="fetchLifeProjectTodos" class="ml-3"></v-overflow-btn>
                    </v-col>
                    <v-col cols="7" md="5">
                        <v-overflow-btn :items="dailyLifeTodoArray" v-model="selectedLifeTodo" v-if="editingDay" @change="triggerNewLifeTodo"></v-overflow-btn>
                    </v-col>
                    <v-col cols="1" md="2" align-center>
                        <v-icon color="success" medium class="pa-6" @click="addDailyLife(date)">mdi-plus-circle-outline</v-icon>
                    </v-col>
                </v-row>
                <v-card-title>Daily Comment</v-card-title>
                <v-textarea v-model="dailySchedule[date].dailyComment" row-height="12" auto-grow outlined clearable placeholder="enter daily comment" :readonly="!((date === editingDate) && (editingDay))" class="mx-3"></v-textarea>
            </v-card>
        </v-card>

        <!-- dialog for Todo/project? -->

        <v-dialog max-width="500px" v-model="todoDialog">
            
            <v-card>
                <v-card-title>{{formTitle}}</v-card-title>
                <v-card-text>
                    <v-text-field readonly :placeholder="selectedProjectForNewTodo.title"></v-text-field>
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
                    <v-btn color="secondary" @click="closeTodo">Cancel</v-btn>
                    <v-btn color="success" @click="save" :loading="loading">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import Navbar from '../components/Navbar';
import ProjectService from '../components/ProjectService';
import {startOfWeek, endOfWeek, eachDayOfInterval, format, parseISO, parse} from 'date-fns';
import WeekService from '../components/WeekService';



export default {
    name: 'Daily',
    components: {
        Navbar
    },
    data() {
        return {
            due_menu: false,
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
            selectedProjectForNewTodo:'',
            todoDialog: false,
            weekSwitch: true,
            weekComment: '',
            selectedLifeTodo: '',
            selectedLifeTag: '',
            selectedGrowthTag:'',
            selectedGrowthTodo: '',
            selectedWorkTag: '',
            selectedWorkTodo:'',
            editingDay: false,
            editingDate: '',
            testWorkArray: [],
            workArray: [],
            growthArray: [],
            lifeArray: [],
            showWeek: true,
            showDay: true,
            projects: [],
            weekDates: [],
            datesToShow: [],
            selectedProjectSerialWork: '',
            selectedProjectSerialGrowth: '',
            selectedProjectSerialLife: '',
            currentWeekSchedule: {

                weekWorkSchedule: {},
                weekGrowthSchedule: {},
                weekLifeSchedule: {},
                weekDates: [],
                weekComment:'',
                dailySchedule: {}
            },
            blankWeekSchedule: {

                weekWorkSchedule: {},
                weekGrowthSchedule: {},
                weekLifeSchedule: {},
                weekDates: {},
                weekComment:'',
                dailySchedule: {}
            },
            weekExist: false,
            weekEditing: false,
            editedIndex: 0, // 0 for edit exisitng week; 1 for creating new week; 2 for edit/create daily; 3/4/5 for create work/growth/life Todo 
            overlay: false,
            loading: false,
            selectedWeekDate: null,
            dayMenu: false,
            weekdayMenu: false,
            dailySchedule: {},
            dailyWorkTodoArray: [],
            dailyGrowthTodoArray: [],
            dailyLifeTodoArray: [],
        }
    },
    async created() {
        this.projects = (await ProjectService.getProjects()).data;
        // console.log(new Date());
        
        // this.selectedWeekDate = new Date();
        this.selectedWeekDate = format(parseISO(new Date().toISOString()), 'yyyy-MM-dd');
        
        
        const temp_ISOString = parse(this.selectedWeekDate, 'yyyy-MM-dd', new Date()).toISOString();
        await this.fetchWeekSchedule(temp_ISOString);
        
        
        
        
        // 
    },
    methods: {
        closeTodo() {
            this.selectedWorkTodo = '';
            this.selectedGrowthTodo = '';
            this.selectedLifeTodo = '';
            this.dailyWorkTodoArray = [];
            this.dailyGrowthTodoArray = [];
            this.dailyLifeTodoArray = [];
            this.selectedWorkTag = '';
            this.selectedGrowthTag = '';
            this.selectedLifeTag = '';
            this.editedIndex = 0;
            this.selectedProjectForNewTodo = '';
            this.editedTodo = Object.assign({}, this.blankTodo);
            this.todoDialog = false;
        },
        triggerNewWorkTodo() {
            if (this.selectedWorkTodo === '_0') {
                this.editedIndex = 3;
                this.todoDialog = true;
                const workIndex = this.selectedWorkTag.slice(1 - this.selectedWorkTag.length);
                this.selectedProjectForNewTodo = this.currentWeekSchedule.weekWorkSchedule[workIndex];
            }
        },
        triggerNewGrowthTodo() {
            if (this.selectedGrowthTodo === '_0') {
                this.editedIndex = 4;
                this.todoDialog = true;
                const growthIndex = this.selectedGrowthTag.slice(1 - this.selectedGrowthTag.length);
                this.selectedProjectForNewTodo = this.currentWeekSchedule.weekGrowthSchedule[growthIndex];
            }
        },
        triggerNewLifeTodo() {
            if (this.selectedLifeTodo === '_0') {
                this.editedIndex = 5;
                this.todoDialog = true;
                const lifeIndex = this.selectedLifeTag.slice(1 - this.selectedLifeTag.length);
                this.selectedProjectForNewTodo = this.currentWeekSchedule.weekLifeSchedule[lifeIndex];
            }
        },
        delDailyWork(date, workTag, index3){
            this.dailySchedule[date].dailyWorkArray[workTag].splice(index3, 1);
            this.$forceUpdate();
        },
        delDailyGrowth(date, growthTag, index3){
            this.dailySchedule[date].dailyGrowthArray[growthTag].splice(index3, 1);
            this.$forceUpdate();
        },
        delDailyLife(date, lifeTag, index3){
            this.dailySchedule[date].dailyLifeArray[lifeTag].splice(index3, 1);
            this.$forceUpdate();
        },

        addDailyWork(date) {
            console.log(date);
            if (this.selectedWorkTodo) {
                if (!this.dailySchedule[date].dailyWorkArray[this.selectedWorkTag]) {
                    this.dailySchedule[date].dailyWorkArray[this.selectedWorkTag] = [];
                }
                this.dailySchedule[date].dailyWorkArray[this.selectedWorkTag].push(this.selectedWorkTodo);
                this.$forceUpdate();
            }
        },
        addDailyGrowth(date) {
            console.log(date);
            if (this.selectedGrowthTodo) {
                if (!this.dailySchedule[date].dailyGrowthArray[this.selectedGrowthTag]) {
                    this.dailySchedule[date].dailyGrowthArray[this.selectedGrowthTag] = [];
                }
                this.dailySchedule[date].dailyGrowthArray[this.selectedGrowthTag].push(this.selectedGrowthTodo);
                this.$forceUpdate();
            }
        },
        addDailyLife(date) {
            console.log(date);
            if (this.selectedLifeTodo) {
                if (!this.dailySchedule[date].dailyLifeArray[this.selectedLifeTag]) {
                    this.dailySchedule[date].dailyLifeArray[this.selectedLifeTag] = [];
                }
                this.dailySchedule[date].dailyLifeArray[this.selectedLifeTag].push(this.selectedLifeTodo);
                this.$forceUpdate();
            }
        },
        editDaily(date) {
            console.log('trying to edit daily');
            this.editingDay = true;
            console.log('editingDay Set');
            this.editingDate = date;
            console.log('editingDate Set');
            this.editedIndex = 2;
            console.log('editedIndex Set');
        },
        async fetchWorkProjectTodos() {
            if (this.selectedWorkTag) {
                this.overlay = true;
                const workIndex = this.selectedWorkTag.slice(1 - this.selectedWorkTag.length);
                const projectID = this.currentWeekSchedule.weekWorkSchedule[workIndex]._id;
                this.dailyWorkTodoArray = (await ProjectService.getProjectTodos(projectID)).data.map((todo) => {
                    return {text: todo.title, value: todo};
                    });
                this.dailyWorkTodoArray.push({text: 'new Todo...', value: '_0'});
                this.overlay = false;
            }
        },
        async fetchGrowthProjectTodos() {
            if (this.selectedGrowthTag) {
                this.overlay = true;
                const growthIndex = this.selectedGrowthTag.slice(1 - this.selectedGrowthTag.length);
                const projectID = this.currentWeekSchedule.weekGrowthSchedule[growthIndex]._id;
                this.dailyGrowthTodoArray = (await ProjectService.getProjectTodos(projectID)).data.map((todo) => {
                    return {text: todo.title, value: todo};
                    });
                this.dailyGrowthTodoArray.push({text: 'new Todo...', value: '_0'});
                this.overlay = false;
            }
        },
        async fetchLifeProjectTodos() {
            
            if (this.selectedLifeTag) {
                this.overlay = true;
                const lifeIndex = this.selectedLifeTag.slice(1 - this.selectedLifeTag.length);
                const projectID = this.currentWeekSchedule.weekLifeSchedule[lifeIndex]._id;
                this.dailyLifeTodoArray = (await ProjectService.getProjectTodos(projectID)).data.map((todo) => {
                    return {text: todo.title, value: todo};
                    });
                this.dailyLifeTodoArray.push({text: 'new Todo...', value: '_0'});
                this.overlay = false;
            }
            
        },
        addTest() {
            if (this.selectedProjectWork) {
                this.testWorkArray.push(this.selectedProjectWork);
            }
        },
        addWork() {
            // console.log(`adding ${this.selectedProjectWork} to work array`);
            // console.log(this.workArray);
            if (this.selectedProjectWork) {
                this.workArray.push(this.selectedProjectWork);
            }
            
        },
        addGrowth() {
            // console.log(`adding ${this.selectedProjectGrowth} to growth array`);
            
            if (this.selectedProjectGrowth) {
                this.growthArray.push(this.selectedProjectGrowth);
            }
        },
        addLife() {
            // console.log(`adding ${this.selectedProjectLife} to life array`);
            
            // this.lifeArray.push(this.selectedProjectLife);
            if (this.selectedProjectLife) {
                this.lifeArray.push(this.selectedProjectLife);
            }
        },
        async selectedDateChange() {
            this.datesToShow = [];
            this.fetchWeekSchedule(this.selectedDateISOString);
            this.dayMenu = false;
            this.close();
            
        },
        async fetchWeekSchedule(ISOString) {
            this.overlay = true;
            this.currentWeekSchedule = (await WeekService.getWeekByDate(ISOString)).data;
            if (this.currentWeekSchedule) {
                this.weekExist = true;
                
            } else {
                this.weekExist = false;
                this.currentWeekSchedule = JSON.parse(JSON.stringify(this.blankWeekSchedule));
            }
            this.weekArrayFromSchedule();

            this.overlay = false;
        },
        createWeek() {
            this.editedIndex = 1; 
            this.weekEditing = true;
        },
        editWeek() {
            this.editedIndex = 0; 
            this.weekEditing = true;
        },
        close() {
            this.weekArrayFromSchedule();
            this.editedIndex = 0;
            this.weekEditing = false;
            this.editingDay = false;
            this.editingDate = '';
            this.selectedLifeTag = '';
            this.selectedLifeTodo = '';
            this.selectedGrowthTag ='';
            this.selectedGrowthTodo = '';
            this.selectedWorkTag = '';
            this.selectedWorkTodo ='';

        },
        weekArrayFromSchedule() {
            this.workArray = this.currentWeekSchedule.weekWorkSchedule ? Object.values(this.currentWeekSchedule.weekWorkSchedule) : [];
            this.growthArray = this.currentWeekSchedule.weekGrowthSchedule ? Object.values(this.currentWeekSchedule.weekGrowthSchedule) : [];
            this.lifeArray = this.currentWeekSchedule.weekLifeSchedule ? Object.values(this.currentWeekSchedule.weekLifeSchedule) : [];
            this.weekComment = this.currentWeekSchedule.weekComment ? this.currentWeekSchedule.weekComment : '';
            this.dailySchedule = JSON.parse(JSON.stringify(this.currentWeekSchedule.dailySchedule));
            console.log('array from schedule completed!');
        },
        delWork(ind) {
            this.workArray.splice(ind, 1);
        },
        delGrowth(ind) {
            this.growthArray.splice(ind, 1);
        },
        delLife(ind) {
            this.lifeArray.splice(ind, 1);
        },
        async save() {
            this.loading = true;
            if ((this.editedIndex === 0) || (this.editedIndex === 1) ) { // 0 edit || 1 create
                
                this.currentWeekSchedule.weekWorkSchedule = this.workArray.reduce((acc, project, index) => {
                    return {...acc, [index + 1]: project};
                }, {});
                this.currentWeekSchedule.weekGrowthSchedule = this.growthArray.reduce((acc, project, index) => {
                    return {...acc, [index + 1]: project};
                }, {});
                this.currentWeekSchedule.weekLifeSchedule = this.lifeArray.reduce((acc, project, index) => {
                    return {...acc, [index + 1]: project};
                }, {});
                this.currentWeekSchedule.weekComment = this.weekComment;
                console.log(this.currentWeekSchedule);
                await WeekService.postWeekByDate(this.selectedDateISOString, this.currentWeekSchedule);
                await this.fetchWeekSchedule(this.selectedDateISOString);
                this.loading = false;
                
                this.close();
                
                
            } else if (this.editedIndex === 2) { // 2 edit/create daily
                this.currentWeekSchedule.dailySchedule = this.dailySchedule;
                console.log(this.currentWeekSchedule);
                await WeekService.postWeekByDate(this.selectedDateISOString, this.currentWeekSchedule);
                await this.fetchWeekSchedule(this.selectedDateISOString);
                this.loading = false;
                this.close();
            } else if ([3, 4, 5].includes(this.editedIndex)) {
                this.editedTodo.project_id = this.selectedProjectForNewTodo._id;
                console.log(this.editedTodo);
                await ProjectService.createProjectTodo(this.editedTodo);
                console.log('new projectTodo created!')
                
                this.closeTodo();
                this.loading = false;
            }
        }
    },
    computed:{
        formTitle() {
            if (this.editedIndex === 3) {
                return 'New Work TODO';
            } else if (this.editedIndex === 4 ) {
                return 'New Growth TODO';
            } else if (this.editedIndex === 5) {
                return 'New Life TODO';
            } else {
                return '';
            }
        },
        datesToShowSorted() {
            if (this.datesToShow) {
                return this.datesToShow.sort();
            }
        },
        projectSerial() {
            if (this.projects) {
                return this.projects.map((project, index) => `${index}.${project.title}`); // create array of 0. Project[0], 1.Project[1]
            }
        },
        weekWorkTag() {
            if (this.currentWeekSchedule.weekWorkSchedule) {
                return Object.values(this.currentWeekSchedule.weekWorkSchedule).map((week, index) => `W${index + 1}`);
            }
        },
        weekGrowthTag() {
            if (this.currentWeekSchedule.weekGrowthSchedule) {
                return Object.values(this.currentWeekSchedule.weekGrowthSchedule).map((week, index) => `G${index + 1}`);
            }
        },
        weekLifeTag() {
            if (this.currentWeekSchedule.weekLifeSchedule) {
                return Object.values(this.currentWeekSchedule.weekLifeSchedule).map((week, index) => `L${index + 1}`);
            }
        },
        selectedProjectWork() {  // get the serial index of the project serie
            if (this.selectedProjectSerialWork) {
                const ind = Number(this.selectedProjectSerialWork.split('.')[0]);
                return this.projects[ind];
            } else {
                return null;
            } 
        }, 
        selectedProjectGrowth() {  // get the serial index of the project serie
            if (this.selectedProjectSerialGrowth) {
                const ind = Number(this.selectedProjectSerialGrowth.split('.')[0]);
                return this.projects[ind];
            } else {
                return null;
            } 
        }, 
        selectedProjectLife() {  // get the serial index of the project serie
            if (this.selectedProjectSerialLife) {
                const ind = Number(this.selectedProjectSerialLife.split('.')[0]);
                return this.projects[ind];
            } else {
                return null;
            } 
        },
        formattedWeekDate() {
            
            return this.selectedWeekDate ? format(parse(this.selectedWeekDate, 'yyyy-MM-dd', new Date()), 'yyMMddE') : '';
        },
        selectedDateISOString() {
            return this.selectedWeekDate ? parse(this.selectedWeekDate, 'yyyy-MM-dd', new Date()).toISOString() : '';
        },
        startOfWeek() {
            return this.selectedWeekDate ? format(startOfWeek(parse(this.selectedWeekDate, 'yyyy-MM-dd', new Date()), {weekStartsOn: 1}), 'yyMMddE') : '';
        },
        endOfWeek() {
            return this.selectedWeekDate ? format(endOfWeek(parse(this.selectedWeekDate, 'yyyy-MM-dd', new Date()), {weekStartsOn: 1}), 'yyMMddE') : '';
        },
        formattedWeekDates() {
            if (this.selectedWeekDate) {
                return eachDayOfInterval({start: startOfWeek(parse(this.selectedWeekDate, 'yyyy-MM-dd', new Date()), {weekStartsOn: 1}),
                                   end: endOfWeek(parse(this.selectedWeekDate, 'yyyy-MM-dd', new Date()), {weekStartsOn: 1})})
                                   .map(weekday => format(weekday, 'yyMMddE'));
            } else {
                return '';
            }
        },
        

    },
    
    
}
</script>

<style>

</style>