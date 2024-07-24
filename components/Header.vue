<template>

<div class="py-2">
    <!-- <h1 class="text-3xl text-green-500">Header</h1> -->

     <!-- <div>User: {{ user == null ? "Anonymous" : user.email  }}</div>  -->

    <button class='cursor-pointer border border-blue-500 p-2 rounded text-blue-500' @click="signout">Signout</button>
    
    </div>

</template>

<script>





export default {




name: 'Header',
props: ['user','store'],

methods: {

   async signout() {
        const { error } = await this.store.supabase.auth.signOut()

        
},


}


}




</script>
    
    
