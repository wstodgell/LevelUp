import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket to store deployment files
    const appBucket = new s3.Bucket(this, 'MyAppBucket', {
      versioned: true,
    });

    // Elastic Beanstalk Application
    const app = new elasticbeanstalk.CfnApplication(this, 'MyApp', {
      applicationName: 'MyElasticBeanstalkApp', // Direct string value
    });

    // IAM Role for Elastic Beanstalk to access S3
    const ebInstanceRole = new iam.Role(this, 'MyElasticBeanstalkInstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkMulticontainerDocker'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
      ],
    });

    const ebInstanceProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
      roles: [ebInstanceRole.roleName],
    });

    // Elastic Beanstalk Environment
    const env = new elasticbeanstalk.CfnEnvironment(this, 'MyAppEnvironment', {
      environmentName: 'MyAppEnv',
      applicationName: app.applicationName as string, // Link to the application
      solutionStackName: '64bit Amazon Linux 2 v5.4.4 running Node.js 14',
      optionSettings: [
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'InstanceType',
          value: 't2.micro',
        },
        {
          namespace: 'aws:elasticbeanstalk:environment',
          optionName: 'EnvironmentType',
          value: 'SingleInstance',
        },
        {
          namespace: 'aws:elasticbeanstalk:container:nodejs',
          optionName: 'NodeCommand',
          value: 'npm start',
        },
        {
          namespace: 'aws:elasticbeanstalk:environment:proxy',
          optionName: 'ProxyServer',
          value: 'nginx',
        },
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: ebInstanceProfile.attrArn,
        },
      ],
    });
  }
}
