/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabUser extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const users = [
            {
                username: 'A',
                email: '1@naver.com',
                phone: '111-1111-1111',
                words: 'apple',
            },
            {
                username: 'B',
                email: '2@naver.com',
                phone: '222-2222-2222',
                words: 'banana',
            },
            {
                username: 'C',
                email: '3@naver.com',
                phone: '333-3333-3333',
                words: 'Cubacake',
            },
            {
                username: 'D',
                email: '4@naver.com',
                phone: '444-4444-4444',
                words: 'dounat',
            },
            {
                username: 'E',
                email: '5@naver.com',
                phone: '555-5555-5555',
                words: 'E',
            }
        
        ];

        const blogs = [
            {
                title:"javascript",
                desc:"javascript language is interpreter language",
                author:
                    {
                        username: 'A',
                        email: '1@naver.com',
                        phone: '111-1111-1111',
                        words: 'apple',
                    }
            },
            {
                title:"java",
                desc:"javas language is compile language",
                author:
                    {
                        username: 'B',
                        email: '2@naver.com',
                        phone: '222-2222-2222',
                        words: 'banana',
                    }
            }
        ]
        for (let i = 0; i < users.length; i++) {
            users[i].docType = 'user';
            await ctx.stub.putState('USER' + i, Buffer.from(JSON.stringify(users[i])));
            console.info('Added <--> ', users[i]);
        }


        for (let i = 0; i < blogs.length; i++) {
            blogs[i].docType = 'blog';
            await ctx.stub.putState('BLOG' + i, Buffer.from(JSON.stringify(blogs[i])));
            console.info('Added <--> ', blogs[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryUser(ctx, userNumber) {
        const userAsBytes = await ctx.stub.getState(userNumber); // get the car from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userNumber} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    async createUser(ctx, userNumber, username, email, phone, words) {
        console.info('============= START : Create User ===========');

        const users = {
            username,
            docType: 'user',
            email,
            phone,
            words,
        };

        await ctx.stub.putState(userNumber, Buffer.from(JSON.stringify(users)));
        console.info('============= END : Create User ===========');
    }

    async queryAllUsers(ctx) {
        const startKey = 'USER0';
        const endKey = 'USER99';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async queryAllBlogs(ctx) {
        const startKey = 'BLOG0';
        const endKey = 'BLOG99';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
    

    async changeUsername(ctx, userNumber, newUsername) {
        console.info('============= START : changeCarOwner ===========');

        const userAsBytes = await ctx.stub.getState(userNumber); // get the user from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userNumber} does not exist`);
        }
        const users = JSON.parse(userAsBytes.toString());
        users.username = newUsername;

        await ctx.stub.putState(userNumber, Buffer.from(JSON.stringify(users)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = FabUser;
