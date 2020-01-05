import { GraphQLServer } from "graphql-yoga";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// ENV VARIABLES
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// models
import Wielder from "./models/wielder";
import Zanpakuto from "./models/zanpakuto";

const typeDefs = `

  type Wielder {
    id: ID!
    name: String!
    zanpakuto: Zanpakuto
  }

  input WielderParameters {
    name: String!
    zanpakuto: String!
  }

  type Zanpakuto {
    id: ID!
    name: String!
    bankai: String!
  }

  input ZanpakutoParameters {
    name: String!
    bankai: String!
  }

  type Query {
    wielders(name: String): [Wielder]
    zanpakutos(name: String): [Zanpakuto]
  }

  type Mutation {
    createWielder(wielderParameters: WielderParameters): Wielder
    updateWielder(name: String!, updatedName: String!, updatedZanpakuto: String!): Wielder
    createZanpakuto(zanpakutoParameters: ZanpakutoParameters): Zanpakuto
    updateZanpakuto(name: String!, updatedName: String!, updatedBankai: String!): Zanpakuto
    removeWielder(name: String!): Wielder
    removeZanpakuto(name: String!): Zanpakuto
  }

`;

const resolvers = {
  Query: {
    wielders: (_, { name }) => {
      if (name) {
        return Wielder.findOne({
          name: { $regex: new RegExp(name, "i") }
        }).then(wielder => [wielder]);
      }
      return Wielder.find().then(wielders => wielders);
    },
    zanpakutos: (_, { name }) => {
      if (name) {
        return Zanpakuto.findOne({
          name: { $regex: new RegExp(name, "i") }
        }).then(zanpakuto => [zanpakuto]);
      }
      return Zanpakuto.find().then(zanpakutos => zanpakutos);
    }
  },
  Wielder: {
    zanpakuto: _ => {
      return Zanpakuto.findOne({
        name: { $regex: new RegExp(_.zanpakuto, "i") }
      }).then(zanpakuto => zanpakuto);
    }
  },
  Mutation: {
    createWielder: (_, { wielderParameters }) => {
      const { name, zanpakuto } = wielderParameters;
      const wielder = new Wielder({ name, zanpakuto });
      wielder.save();
      return wielder;
    },
    createZanpakuto: (_, { zanpakutoParameters }) => {
      const { name, bankai } = zanpakutoParameters;
      const zanpakuto = new Zanpakuto({ name, bankai });
      zanpakuto.save();
      return zanpakuto;
    },
    updateWielder: (_, { name, updatedName, updatedZanpakuto }) => {
      const updatedWielder = { name: updatedName, zanpakuto: updatedZanpakuto };
      return Wielder.findOneAndUpdate(
        { name: { $regex: new RegExp(name, "i") } },
        updatedWielder,
        { new: true }
      ).then(updatedWielder => updatedWielder);
    },
    updateZanpakuto: (_, { name, updatedName, updatedBankai }) => {
      const updatedZanpakuto = { name: updatedName, bankai: updatedBankai };
      return Zanpakuto.findOneAndUpdate(
        { name: { $regex: new RegExp(name, "i") } },
        updatedZanpakuto,
        { new: true }
      ).then(updatedZanpakuto => updatedZanpakuto);
    },
    removeWielder: (_, { name }) => {
      return Wielder.findOneAndRemove({
        name: { $regex: new RegExp(name, "i") }
      }).then(removedWielder => removedWielder);
    },
    removeZanpakuto: (_, { name }) => {
      return Zanpakuto.findOneAndRemove({
        name: { $regex: new RegExp(name, "i") }
      }).then(removedZanpakuto => removedZanpakuto);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start({ port: PORT }, () => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => console.log("Connected to MongoDB!"));
});
