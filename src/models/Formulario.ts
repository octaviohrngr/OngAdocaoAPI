import mongoose, {Schema} from "mongoose";
import { IFormularioDocument } from "../interfaces/IFormulario";

const FormularioSchema = new Schema<IFormularioDocument>(
    {
        usuarioId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        nome: {
            type: String,
            requered: true,
            trim: true, 
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        telefone: {
            type: String,
            required: true,
            trim: true,
            },

            tipoMoradia: {
                type: String,
                required: true,
                trim: true,
            },

            tempoMedioSozinho: {
                type: String,
                required: true,
                trim: true,
            },

            mensagem: {
                type: String,
                required: true,
                trim: true,
            },

            aceitarTermos: {
                type: Boolean,
                required: true,
            },
        },    
        {
            timestamps: true,
        }
    
);

export default mongoose.model<IFormularioDocument>(
    "Formulario",
    FormularioSchema
);