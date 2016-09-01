package lv.ipr.dm.mc;

/**
 * Created with IntelliJ IDEA.
 * User: MaksimMarkov
 * Date: 24/03/15
 * Time: 19:10
 * To change this template use File | Settings | File Templates.
 */

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AppConfig {


    public static void main(String[] args) {
        SpringApplication.run(AppConfig.class, args);
    }

}
