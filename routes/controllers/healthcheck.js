module.exports = async function (fastifyInstance) {
   fastifyInstance.get(
      '/',
      {
         schema: {
            tags: ['main'],
            description: 'Main page',
            response: {
               200: {
                  description: 'Successful response',
                  type: 'object',
                  properties: {
                     status: { type: 'string' },
                  },
               },
            },
         },
      },
      () => ({ status: 'up' })
   )
}
