import { Request, Response } from 'express';
import { IActivity } from '../utils/activityValidator';
import { Activity } from '../models/Activity';

export class ActivityController {
  static async CreateActivity(req: Request<{id:string}, {}, IActivity>, res: Response) {
    try {

      let status;

      req.body.category == 'Salário' || 
      req.body.category == 'Renda extra' 
        ? status = 'Receita' 
        : status = 'Despesa';

      const newActivity = await new Activity({
        date: req.body.date,
        category: req.body.category,
        description: req.body.description,
        cash: req.body.cash,
        userId: req.params.id,
        status
      });

      newActivity.save();

      console.log(newActivity);

      res.status(201).json({ message: 'Atividade criada!', newActivity});
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async GetActivitiesByUser (req: Request, res: Response) {

    try {
      
      const userId = req.params.id;

      const userActivities = await Activity.find({userId}).populate({
        path: 'userId',
        match: {_id: userId}
  
      }).exec();

      res.status(200)
        .send({
          message:'Dados encontrados.',
          userActivities
        });

    } catch (error) {
      res.status(404).send({error: 'dados não encontrados.'});
    }
     
  }
  
  static async GetActibityDataByUser (req: Request, res: Response) {
    const userId = req.params.id;

    // const userActivities = await Activity.find({userId}).populate({
    //   path: 'userId',
    //   match: {_id: userId}

    // }).exec();

    try {
        
      const sumReceita = await Activity.aggregate([
        { $match: {userId, 'status': 'Receita'} },
        {$project: {
          cash: '$cash',
          status: '$status'
        }},
        {
          $group: {
            _id: '$status',
            totalReceita: { $sum: '$cash' }
          }
        }
      ]).exec();
    
      const sumDespesa = await Activity.aggregate([
        { $match: {userId, 'status': 'Despesa'} },
        {$project: {
          cash: '$cash',
          status: '$status'
        }},
        {
          $group: {
            _id: '$status',
            totalDespesa: { $sum: '$cash' }
          }
        }
      ]);
    
      const sumRendaExtra = await Activity.aggregate([
        { $match: {userId, 'category': 'Renda extra'} },
        {$project: {
          cash: '$cash',
          category: '$category'
        }},
        {
          $group: {
            _id: '$category',
            totalRendaExtra: { $sum: '$cash' }
          }
        }
      ]);
    
      const sumSalário = await Activity.aggregate([
        { $match: {userId, 'category': 'Salário'} },
        {$project: {
          cash: '$cash',
          category: '$category'
        }},
        {
          $group: {
            _id: '$category',
            totalSalario: { $sum: '$cash' }
          }
        }
      ]);
    
      res.status(200)
        .send({
          message:'Dados encontrados.',
          sumReceita, sumDespesa, sumRendaExtra, sumSalário});

    } catch (error) {
      res.status(404).send({error: 'dados não encontrados.'});
    }
      
  }

  static async UpdateActivity (req: Request<{id:string}, {}, IActivity>, res: Response) {
    try {
      const id = req.params.id;      

      const activityExists = await Activity.findById({_id: id});

      if(!activityExists) return res.status(422).json({ message: 'ID inválido.' });

      let status;

      req.body.category == 'Salário' || 
      req.body.category == 'Renda extra' 
        ? status = 'Receita' 
        : status = 'Despesa';

      const activity = ({
        date: req.body.date,
        category: req.body.category,
        description: req.body.description,
        cash: req.body.cash,
        status
      });

      await Activity.updateOne({_id: id}, activity);

      return res.status(201).json({ message: 'Atividade atualizado.' });
        
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar.' });
    }
  }
}