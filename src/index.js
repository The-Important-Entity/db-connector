'use strict';
const {Client} = require("pg");
const config = require("./config");
class dbConnector {
    constructor() {
        this.client = new Client({
            "host": config.DB_HOST,
            "user": config.DB_USER,
            "password": config.DB_PASS,
            "database": config.DB,
            "port": config.DB_PORT,
        });

        this.client.on('error', e => {
            throw e;
        });

        this.client.connect();
    }

    async makeQuery(query, params) {
        try {
            const response = await this.client.query(query, params);
            return response.rows;
        }
        catch(err) {
            return err;
        }
    }

    async getOrganization(name) {
        return await this.makeQuery(`SELECT * 
                                     FROM organization.organization 
                                     WHERE organization.organization.name=$1`, 
                                     [name]);
    }

    async postOrganization(name, email, password) {
        return await this.makeQuery(`INSERT INTO organization.organization(name, email, password) 
                                     VALUES ($1, $2, $3) 
                                     RETURNING *`, 
                                     [name, email, password]);
    }

    async deleteOrganization(name) {
        return await this.makeQuery(`DELETE FROM organization.organization 
                                     WHERE organization.organization.name=$1 
                                     RETURNING *`, 
                                     [name]);
    }

    async getAllSecurityGroups(org_id) {
        return await this.makeQuery(`SELECT * 
                                     FROM organization.security_groups 
                                     WHERE organization.security_groups.org_id=$1`, 
                                     [org_id]);
    }

    async getSecurityGroup(group_id) {
        return await this.makeQuery(`SELECT * 
                                     FROM organization.security_groups 
                                     WHERE organization.security_groups.id=$1`, 
                                     [group_id]);
    }

    async postSecurityGroup(org_id, alias) {
        return await this.makeQuery(`INSERT INTO organization.security_groups(org_id, alias) 
                                     VALUES ($1, $2) 
                                     RETURNING *`, 
                                     [org_id, alias]);
    }

    async updateSecurityGroup(group_id, alias) {
        return await this.makeQuery(`UPDATE organization.security_groups 
                                     SET alias=$2 
                                     WHERE organization.security_groups.id=$1 
                                     RETURNING *`, 
                                     [group_id, alias]);
    }

    async deleteSecurityGroup(group_id) {
        return await this.makeQuery(`DELETE FROM organization.security_groups 
                                     WHERE organization.security_groups.id=$1 
                                     RETURNING *`, 
                                     [group_id]);
    }

    async getSecurityPerms(group_id) {
        return await this.makeQuery(`SELECT * 
                                     FROM organization.security_perms 
                                     WHERE organization.security_perms.group_id=$1`, 
                                     [group_id]);
    }

    async postSecurityPerm(group_id, namespace, read_perm, write_perm) {
        return await this.makeQuery(`INSERT INTO organization.security_perms(group_id, namespace, read_perm, write_perm) 
                                     VALUES ($1, $2, $3, $4) 
                                     RETURNING *`, 
                                     [group_id, namespace, read_perm, write_perm]);
    }

    async updateSecurityPerm(id, namespace, read_perm, write_perm) {
        return await this.makeQuery(`UPDATE organization.security_perms 
                                     SET namespace=$2, read_perm=$3, write_perm=$4 
                                     WHERE organization.security_perms.id=$1 
                                     RETURNING *`, 
                                     [id, namespace, read_perm, write_perm]);
    }

    async deleteSecurityPerm(id) {
        return await this.makeQuery(`DELETE FROM organization.security_perms 
                                     WHERE organization.security_perms.id=$1 
                                     RETURNING *`, 
                                     [id]);
    }

    async getAllNamespaces(org_id) {
        return await this.makeQuery(`SELECT * 
                                     FROM organization.namespaces 
                                     WHERE organization.namespaces.org_id=$1`, 
                                     [org_id]);
    }

    async postNamespace(org_id, name) {
        return await this.makeQuery(`INSERT INTO organization.namespaces(org_id, name) 
                                     VALUES ($1, $2) 
                                     RETURNING *`, 
                                     [org_id, name]);
    }

    async deleteNamespace(name) {
        return await this.makeQuery(`DELETE FROM organization.namespaces 
                                     WHERE organization.namespaces.name=$1 
                                     RETURNING *`, 
                                     [name]);
    }

    async getAccessKeys(group_id) {
        return await this.makeQuery(`SELECT organization.access_keys.id, organization.access_keys.group_id, organization.access_keys.app_id 
                                     FROM organization.access_keys 
                                     WHERE organization.access_keys.group_id=$1`, 
                                     [group_id]);
    }

    async getAccessKeysWithOrg(org_id) {
        return await this.makeQuery(`SELECT organization.access_keys.id, organization.access_keys.group_id, organization.access_keys.app_id 
                                     FROM organization.access_keys,organization.security_groups 
                                     WHERE organization.security_groups.org_id=$1 
                                     AND organization.security_groups.id=organization.access_keys.group_id`, 
                                     [org_id]);
    }

    async getAppId(app_id) {
        return await this.makeQuery(`SELECT organization.access_keys.id, organization.access_keys.group_id, organization.access_keys.app_id 
                                     FROM organization.access_keys 
                                     WHERE organization.access_keys.app_id=$1`, 
                                     [app_id]);
    }

    async getSecret(app_id, namespace) {
        return await this.makeQuery(`SELECT organization.access_keys.group_id,organization.access_keys.secret, 
                                            organization.security_perms.read_perm, organization.security_perms.write_perm 
                                     FROM organization.access_keys, organization.security_perms 
                                     WHERE organization.access_keys.app_id=$1 
                                     AND organization.access_keys.group_id=organization.security_perms.group_id 
                                     AND organization.security_perms.namespace=$2`, 
                                     [app_id, namespace]);
    }

    async getSecretWithoutNamespace(app_id) {
        return await this.makeQuery(`SELECT organization.security_groups.org_id,organization.access_keys.group_id,organization.access_keys.secret 
                                     FROM organization.security_groups,organization.access_keys 
                                     WHERE organization.access_keys.app_id=$1 
                                     AND organization.security_groups.id=organization.access_keys.group_id`, 
                                     [app_id]);
    }

    async postAccessKey(group_id, app_id, secret) {
        return await this.makeQuery(`INSERT INTO organization.access_keys(group_id, app_id, secret) 
                                     VALUES($1, $2, $3) 
                                     RETURNING *`, 
                                     [group_id, app_id, secret]);
    }

    async deleteAccessKey(app_id) {
        return await this.makeQuery(`DELETE FROM organization.access_keys 
                                     WHERE organization.access_keys.app_id=$1 
                                     RETURNING id, group_id, app_id`, 
                                     [app_id]);
    }

    close(){
        this.client.end();
    }
}

module.exports = dbConnector;