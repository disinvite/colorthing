<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Alias</th>
          <th>Value</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(alias, index) in Object.keys(value)" v-bind:key="index">
          <td>{{ alias }}</td>
          <td>{{ value[alias] }}</td>
          <td><button v-on:click="remove(alias)">x</button></td>
        </tr>
        <tr>
          <td>
            <input v-model="inputAlias" />
          </td>
          <td>
            <input v-model="inputValue" />
          </td>
          <td>
            <button v-on:click="newAlias">Save</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'AliasTable',
  props: {
    value: Object
  },
  methods: {
    remove(which) {
      this.$delete(this.value, which);
    },
    newAlias() {
      const newA = this.inputAlias.trim();
      const newV = parseInt(this.inputValue.trim());
      if (newA === '') {
        return;
      }
      if (isNaN(newV)) {
        return;
      }
      if (newV < 0) {
        return;
      }

      this.$set(this.value, newA, newV);
      this.inputAlias = '';
      this.inputValue = '';
    }
  },
  data: () => {
    return {
      inputAlias: '',
      inputValue: '',
    };
  }
}
</script>

<style scoped>
</style>
